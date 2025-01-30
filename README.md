# KafkaJs

Адаптер для работы с брокерами сообщений

## Технологии

- KafkaJs - ^2.2.4
- DotEnv - ^16.4.5
- TypeScript - ^5.4.5

## Принцип работы

1. Создать .env файл или добавить в него содержимое:

**KAFKA**=

```json
{ "user": "platform", "pass": "PASSWORD", "cert": "C:/YandexCA.crt", "brokers": ["broker-url"] }
```

Можно также вызвать создание BrokerFactory передав в него config

```javascript
const reportKafkaFactory = new BrokerFactory({ brokers: [], clientId: "" });
```

2.  Пример использования:

```javascript
const reportKafkaFactory = new BrokerFactory();
	let producer: Producer;
	let consumer: Consumer;
```

```javascript
test.beforeAll(async () => {
	producer = reportKafkaFactory.producer();
	consumer = reportKafkaFactory.consumer();
	await producer.connect();
	await consumer.connect({ topics: ["platform.messaging-stage.send-email-completed"] });
});
```

```javascript
test.afterAll(async () => {
	await consumer.disconnect();
});
```

```javascript
test("test", async () => {
	producer.send({
		topic: "platform.messaging-stage.send-email",
		messages: [
			{
				headers: {
					"message-type": "SendEmailMessage",
					"message-id": "22e9502a-7dde-416e-88e5-e172523f9975",
					"correlation-id": "14e9502a-7dde-416e-88e5-e172523f9975",
				},
				value: JSON.stringify({
					ContextSender: 1,
					Recipient: "a.sotskov@rowi.com",
					Subject: "Test Kafka 5",
					Body: "Test",
					BusinessContext: {
						Product: "guarantee",
						Company: "izum",
						WhiteLabel: "na",
					},
				}),
			},
		],
	});

	await consumer.run(async (x) => {
		return Promise.resolve(console.log(x));
	});
});
```

Рекомендуется создать фикстуру.
