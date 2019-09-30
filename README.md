# Google Weather Frog
An automatic scrubber of Google Weather's frog images for personal use.

## Scrubbing
Run `scrub.sh` on a cronjob to grab the latest images, logs are available at `scrub-[date]_[time].log`

Example usage: `*/30 * * * * cd /home/[user]/Google-Weather-Frog/ && bash scrub.sh`

## Syncing
Run `sync.sh` on a cronjob to get the corresponding missing wides and/or squares, logs are available at `sync-[date]_[time].log`

Example usage: `15 */12 * * * cd /home/[user]/Google-Weather-Frog/ && bash sync.sh`

## Website
Run `website.sh` on a cronjob to update the website's `index.html`, logs are available at `website-[date]_[time].log`

Example usage: `0 */12 * * * cd /home/[user]/Google-Weather-Frog/ && bash website.sh`

## Clean-up
To clean up the massive amounts of `.log` files produced by the bash scripts, you can run a cronjob.

Example usage: `0 0 * * SUN cd /home/[user]/Google-Weather-Frog/ && rm *.log`
