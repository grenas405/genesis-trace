// tests/remote-logger.test.ts
import { assertEquals, assertExists } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { RemoteDestination } from "../core/remote-logger.ts";
import { RemoteLogger } from "../core/RemoteLogger.ts";

Deno.test("RemoteLogger - Basic creation", () => {
  const logger = new RemoteLogger({
    destinations: [{
      name: "test",
      url: "https://example.com/logs",
    }],
  });

  assertExists(logger);
  assertEquals(logger.getBufferSize(), 0);
});

Deno.test("RemoteLogger - Log buffering", () => {
  const logger = new RemoteLogger({
    destinations: [{
      name: "test",
      url: "https://example.com/logs",
    }],
    batchSize: 10,
  });

  logger.log({
    timestamp: new Date(),
    level: "info",
    message: "Test log",
  });

  assertEquals(logger.getBufferSize(), 1);
});

Deno.test("RemoteLogger - Level filtering", () => {
  const logger = new RemoteLogger({
    destinations: [{
      name: "test",
      url: "https://example.com/logs",
    }],
    minLevel: "warning",
  });

  logger.log({
    timestamp: new Date(),
    level: "info",
    message: "Should be ignored",
  });

  logger.log({
    timestamp: new Date(),
    level: "error",
    message: "Should be logged",
  });

  assertEquals(logger.getBufferSize(), 1);
});

Deno.test("RemoteLogger - Stats tracking", () => {
  const logger = new RemoteLogger({
    destinations: [
      { name: "dest1", url: "https://example.com/logs1" },
      { name: "dest2", url: "https://example.com/logs2" },
    ],
  });

  const stats = logger.getStats();
  assertEquals(stats.totalDestinations, 2);
  assertEquals(stats.bufferSize, 0);
  assertEquals(stats.healthyDestinations, 2);
});

Deno.test("RemoteLogger - Add/Remove destinations", () => {
  const logger = new RemoteLogger({
    destinations: [{
      name: "initial",
      url: "https://example.com/logs",
    }],
  });

  assertEquals(logger.getStats().totalDestinations, 1);

  logger.addDestination({
    name: "new",
    url: "https://example.com/logs2",
  });

  assertEquals(logger.getStats().totalDestinations, 2);

  logger.removeDestination("initial");
  assertEquals(logger.getStats().totalDestinations, 1);
});

Deno.test("RemoteLogger - Clear buffer", () => {
  const logger = new RemoteLogger({
    destinations: [{
      name: "test",
      url: "https://example.com/logs",
    }],
  });

  logger.log({
    timestamp: new Date(),
    level: "info",
    message: "Test",
  });

  assertEquals(logger.getBufferSize(), 1);

  logger.clearBuffer();
  assertEquals(logger.getBufferSize(), 0);
});
