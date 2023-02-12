import express from 'express';
import JWT, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const authenticate = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const token = req.headers.authorization;

  if (!token) {
    res.status(401).json({ error: 'token is not available' });
    return;
  }

  try {
    const payload = JWT.verify(token, process.env.TOKEN_SECRET as string);
    next();
  } catch (error) {
    res.status(401).json({ error: 'authentication failed! ' + `${error}` });
  }
};

export const authorize = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const token = req.headers.authorization;
  const userId =
    req.params.userId ||
    (req.body.userId as string) ||
    (req.query.userId as string);

  if (!token) {
    res.status(401).json({ error: 'token is not available' });
    return;
  }

  try {
    const payload = JWT.verify(token, process.env.TOKEN_SECRET as string);

    if ((payload as JwtPayload).id === userId) {
      next();
    } else {
      res.status(401).json({ error: 'authentication failed!' });
    }
  } catch (error) {
    res.status(401).json({ error: 'authentication failed! ' + `${error}` });
  }
};

export const isDesignerAuth = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const token = req.headers.authorization;
  const userId = req.params.userId || req.body.userId || req.query.userId;

  if (!token) {
    res.status(401).json({ error: 'token is not available' });
    return;
  }

  try {
    const payload = JWT.verify(token, process.env.TOKEN_SECRET as string);

    if (
      (payload as JwtPayload).id === userId &&
      ((payload as JwtPayload).role === 'designer' ||
        (payload as JwtPayload).role === 'admin')
    ) {
      next();
    } else {
      res.status(401).json({ error: 'authentication failed!' });
    }
  } catch (error) {
    res.status(401).json({ error: 'authentication failed! ' + `${error}` });
  }
};

export const isAdminAuth = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const token = req.headers.authorization;
  const userId = req.params.userId || req.body.userId || req.query.userId;

  if (!token) {
    res.status(401).json({ error: 'token is not available' });
    return;
  }

  try {
    const payload = JWT.verify(token, process.env.TOKEN_SECRET as string);

    if (
      (payload as JwtPayload).id === userId &&
      (payload as JwtPayload).role === 'admin'
    ) {
      next();
    } else {
      res.status(401).json({ error: 'authentication failed!' });
    }
  } catch (error) {
    res.status(401).json({ error: 'authentication failed! ' + `${error}` });
  }
};
