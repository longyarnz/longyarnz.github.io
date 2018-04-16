import { assert } from 'chai';
import logger from '../../src/logger';

/**
 * @description
 * Test the logger object for the log method
 */
describe('logger', () => {
  it('should have a log method', () => {
    logger.info('testing the logger');
    assert.property(logger, 'log', 'can log to file');
  });
});