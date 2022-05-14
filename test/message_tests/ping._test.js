
export default {
    name: "Test ping",
    message: "Testing ping command",
    async execute(userClient) {
        test('Test command response',async () => {
            await userClient.sendTestMessage("dl!ping");
            let message = await userClient.getNextMessage();
            expect(message.content).toBe("Pong!");
        })
    }
}