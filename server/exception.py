"""
Simulates a production error flow

Usage:
    python exception.py --repeat # sends random interval exceptions.
    python exception.py
"""
from ably import AblyRest
import json
import traceback
import sys
import argparse
import os
import time
import asyncio
import random
from dotenv import load_dotenv

load_dotenv()

ABLY_CHANNEL = os.environ.get('ABLY_CHANNEL')
ABLY_KEY = os.environ.get('ABLY_KEY')

class CustomException:
    def __init__(self, error):
        # parse metadata from raw exception error
        self.type = error.__class__.__name__
        self.message = str(error)
        self.timestamp = int(time.time()) * 1000
        exception_traceback = traceback.format_exception(*sys.exc_info())
        self.trace =  ''.join(exception_traceback)

    def get_json(self):
        json_representation = json.dumps(self.__dict__)
        return json_representation

# This could be called in a production context with access to an ably channel.
async def publish_exception(channel , e: Exception):
    message = CustomException(e).get_json()
    result = await channel.publish('exception', message)
    print('Published error: ', message)

async def simulate_error(channel):
    try:
        result = 1 / 0 # some error
    except Exception as e:
        await publish_exception(channel, e)

async def main():
    # https://docs.python.org/3/library/argparse.html#example
    parser = argparse.ArgumentParser()
    parser.add_argument('--timestamp', required=False, default=None)
    parser.add_argument('--repeat', action=argparse.BooleanOptionalAction)
    args = parser.parse_args()

    # https://github.com/ably/ably-python#running-example
    async with AblyRest(ABLY_KEY) as ably:
        channel = ably.channels.get(ABLY_CHANNEL)
        if args.repeat:
            while True:
                await simulate_error(channel)
                # Random sleep between 1 to 2 seconds
                await asyncio.sleep(1 + random.random())
        else:
            # One time error send.
            await simulate_error(channel)

# Example usage: python exception.py --type ArithmeticException --message '/ by zero' --repeat
if __name__ == '__main__':
    print('Starting exception script')
    asyncio.run(main())

