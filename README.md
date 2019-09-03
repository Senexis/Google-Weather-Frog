# Google Weather Frog
An automatic scrubber of Google Weather's frog images for personal use.

## Scrubbing
Run `scrub.sh` on a cronjob to grab the latest images, logs are available at `[date]_[time].log`

Example usage: `*/30 * * * * cd /home/[user]/Google-Weather-Frog/ && bash scrub.sh`

## Syncing
Run `sync.sh` on a cronjob to get the corresponding missing wides and/or squares, logs are available at `[date]_[time].log`

Example usage: `15 */12 * * * cd /home/[user]/Google-Weather-Frog/ && bash sync.sh`
