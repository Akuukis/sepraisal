#!/bin/bash

date +%r

# Run routine 0
echo "Running routine 0..."
timeout 5h yarn launch 0 >> out-0.log 2>> err-0.log < /dev/null

date +%r

# Run routine 1
echo "Running routine 1..."
timeout 5h yarn launch 1 >> out-1.log 2>> err-1.log < /dev/null

date +%r

# Run routine 2
echo "Running routine 2..."
timeout 5h yarn launch 2 >> out-2.log 2>> err-2.log < /dev/null

date +%r

# Run routine 3
echo "Running routine 3..."
timeout 5h yarn launch 3 >> out-3.log 2>> err-3.log < /dev/null

date +%r

# Run routine 4
echo "Running routine 4..."
timeout 5h yarn launch 4 >> out-4.log 2>> err-4.log < /dev/null

date +%r

# Run routine 5
echo "Running routine 5..."
timeout 5h yarn launch 5 >> out-5.log 2>> err-5.log < /dev/null

date +%r

# Run routine 5 in serial mode
echo "Running routine 5 in serial mode..."
timeout 1h yarn launch 5 --serial >> out-5.log 2>> err-5.log < /dev/null

date +%r

echo "All routines completed!"
