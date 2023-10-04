from ably import AblyRest
import json
import argparse
import os
import time
import asyncio
from dotenv import load_dotenv

# dotenv.config()

load_dotenv()

ABLY_CHANNEL = os.environ.get('ABLY_CHANNEL')
ABLY_KEY = os.environ.get('ABLY_KEY')

class CustomException:
    def __init__(self, type, message, timestamp=None):
        self.type = type
        self.message = message
        if not timestamp:
            timestamp = int(time.time())

        self.timestamp = timestamp

    def get_json(self):
        json_representation = json.dumps(self.__dict__)
        return json_representation

async def main():
    # https://docs.python.org/3/library/argparse.html#example
    parser = argparse.ArgumentParser()
    parser.add_argument('--type', required=True)
    parser.add_argument('--message', required=True)
    parser.add_argument('--timestamp', required=False)
    args = parser.parse_args()

    exception = CustomException(args.type, args.message, args.timestamp)
    # https://github.com/ably/ably-python#running-example
    async with AblyRest(ABLY_KEY) as ably:
        channel = ably.channels.get(ABLY_CHANNEL)
        message = exception.get_json()
        result = await channel.publish('exception', message)
        print('publish', result)

# Example usage: python exception.py --type ArithmeticException --message / by zero --timestamp 1696376020
if __name__ == '__main__':
    asyncio.run(main())

