# Google-Weather-Frog

## Scrubbing
Run `scrub.sh` on a cronjob to grab the latest images, logs are available at `[date].log`

Example usage: `*/30 * * * * sh ~/Google-Weather-Frog/scrub.sh`

## Syncing
Run `scrub.sh` on a cronjob to get the corresponding missing wides and/or squares, logs are available at `[date].log`

Example usage: `15 */12 * * * sh ~/Google-Weather-Frog/sync.sh`