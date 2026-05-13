import 'dotenv/config';
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { config } from '@silentsiren/config';
import { createLogger } from '@silentsiren/logger';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { securityMiddleware } from './middleware/security';
import { rateLimiter } from './middleware/rateLimiter';
import apiRoutes from './routes';
import { redisService } from './services/redis.service';

const logger = createLogger('backend');

class Server {
  private app: Application;
  private port: number;

  constructor() {
    this.app = express();
    this.port = parseInt(config.PORT, 10);
    this.initialize();
  }

  private async initialize(): Promise<void> {
    await this.initializeRedis();
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private async initializeRedis(): Promise<void> {
    try {
      await redisService.connect();
      logger.info('Redis connected successfully');
    } catch (error) {
      logger.error('Failed to connect to Redis:', error);
      logger.warn('Server will continue without Redis - some features may be limited');
    }
  }

  private initializeMiddleware(): void {
    this.app.use(helmet());
    this.app.use(
      cors({
        origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        credentials: true,
      })
    );
    this.app.use(compression());
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    this.app.use(requestLogger);
    this.app.use(securityMiddleware);
    this.app.use(rateLimiter);
  }

  private initializeRoutes(): void {
    this.app.get('/health', (_req: Request, res: Response) => {
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: config.NODE_ENV,
      });
    });

    this.app.use('/api', apiRoutes);

    this.app.use('*', (_req: Request, res: Response) => {
      res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Route not found',
        },
      });
    });
  }

  private initializeErrorHandling(): void {
    this.app.use(errorHandler);
  }

  public start(): void {
    this.app.listen(this.port, () => {
      logger.info(`Server running on port ${this.port} in ${config.NODE_ENV} mode`);
    });
  }

  public async shutdown(): Promise<void> {
    logger.info('Shutting down server...');
    await redisService.disconnect();
    logger.info('Server shutdown complete');
  }
}

const server = new Server();
server.start();

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received');
  await server.shutdown();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received');
  await server.shutdown();
  process.exit(0);
});

export default server;
