#!/usr/bin/env bash

# Update and install dependencies
apt-get update
apt-get install -y wget --no-install-recommends
apt-get install -y ca-certificates fonts-liberation libappindicator3-1 libasound2 libatk-bridge2.0-0 libatk1.0-0 libcups2 libdbus-1-3 libdrm2 libxkbcommon-x11-0 libxcomposite1 libxdamage1 libxrandr2 libgbm1 libgtk-3-0

# Download Chrome
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
dpkg -i google-chrome-stable_current_amd64.deb
apt-get -f install -y

echo "Dependencies installed."
