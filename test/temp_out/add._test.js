import {jest} from '@jest/globals';


export default {
    name: "Test add command",
    message: "Testing add command",
    async execute(userClient) {
        describe("Test all scenario for add command", () => {
            let testTime = Date.now() + 3*24*60*60*1000;

            beforeAll(() => {
                jest.spyOn(Date, 'now').mockImplementation(() => testTime);
            });

            afterAll(() => {
                Date.now.mockRestore();
            })

            afterEach( async () => {
                await new Promise((r) => setTimeout(r, 1500));
            })

            test("first add with text and image", async() => {
                await userClient.sendImageMessage("dl!add hello add test database");
                let message = await userClient.getNextMessage();
                expect(message.content).toBe("Your current streak is 1 days!");
            });

            test("Second add, expect inceased streak", async () => {
                testTime += 24*60*60*1000; // 24 hours
                await userClient.sendImageMessage("dl!add another test");
                let message = await userClient.getNextMessage();
                expect(message.content).toBe("Your current streak is 2 days!");
            });

            test("Third add, expect inceased streak", async () => {
                testTime += 19*60*60*1000; // 19 hours
                await userClient.sendImageMessage("dl!add another 3rd test");
                let message = await userClient.getNextMessage();
                expect(message.content).toBe("Your current streak is 3 days!");
            });

            test("add reset streak", async () => {
                testTime += 3*24*60*60*1000;
                await userClient.sendImageMessage("dl!add _test This should reset to 1 streak");
                let message = await userClient.getNextMessage();
                expect(message.content).toBe("Your current streak is 1 days!");
            });

            test("add keep same streak", async () => {
                testTime += 17*60*60*1000;
                await userClient.sendImageMessage("dl!add _test This should keep same streak");
                let message = await userClient.getNextMessage();
                expect(message.content).toBe("Your current streak is 1 days!");
            });

        });
    }
}