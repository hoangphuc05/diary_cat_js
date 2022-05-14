import {jest} from '@jest/globals';

// set baseTime as 3 day from now for clean testing

// Mock time function and add 3 days to today

export default {
    name: "Test add text",
    message: "Testing add command",
    async execute(userClient) {
        describe("Test all case for addText", () => {
            let testTime = Date.now() + 13*24*60*60*1000;

            beforeAll(() => {
                jest.spyOn(Date, 'now').mockImplementation(() => testTime);
            });

            afterAll(() => {
                Date.now.mockRestore();
            })

            afterEach( async () => {
                await new Promise((r) => setTimeout(r, 1500));
            })

            test('add text with empty value', async () => {
                await userClient.sendTestMessage("dl!addText");
                let message = await userClient.getNextMessage();
                expect(message.content).toBe("You need to enter some content or attach a file to post");
            });
    
            test('Test first add command', async () => {
                await userClient.sendTestMessage("dl!addText hello test database");
                let message = await userClient.getNextMessage();
                expect(message.content).toBe("Your current streak is 1 days!");
            });

            test("No increase streak 1", async () => {
                testTime += 17*60*60*1000; // 17 hours
                await userClient.sendTestMessage("dl!addText _test This should not increase streak");
                let message = await userClient.getNextMessage();
                expect(message.content).toBe("Your current streak is 1 days!");
            })
    
            test('2 day streak', async () => {
                testTime += 24*60*60*1000;
                await userClient.sendTestMessage("dl!addText hello day 2");
                let message = await userClient.getNextMessage();
                expect(message.content).toBe("Your current streak is 2 days!");
            });

            test('3 day streak', async () => {
                testTime += 24*60*60*1000;
                await userClient.sendTestMessage("dl!addText hello day 3");
                let message = await userClient.getNextMessage();
                expect(message.content).toBe("Your current streak is 3 days!");
            });

            test('reset streak', async () => {
                testTime += 3*24*60*60*1000;
                await userClient.sendTestMessage("dl!addText _test This should reset to 1 streak");
                let message = await userClient.getNextMessage();
                expect(message.content).toBe("Your current streak is 1 days!");
            });

            test("No increase streak 2", async () => {
                testTime += 17*60*60*1000; // 17 hours
                await userClient.sendTestMessage("dl!addText _test This should not increase streak");
                let message = await userClient.getNextMessage();
                expect(message.content).toBe("Your current streak is 1 days!");
            });

            

        })
        
    }
}