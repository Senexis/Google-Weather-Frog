# Google Weather Frog
An automatic scrubber of Google Weather's frog images for personal use.

## Crossing
Run `cross.sh` on a cronjob to cross-sync all image types and names, logs are available at `cross-[date]_[time].log`

## Scrubbing
Run `scrub.sh` on a cronjob to grab the latest images, logs are available at `scrub-[date]_[time].log`

## Syncing
Run `sync.sh` on a cronjob to get the corresponding missing wides and/or squares, logs are available at `sync-[date]_[time].log`

## Weather
Run `weather.sh` on a cronjob to update pre-defined location weather images, logs are available at `weather-[date]_[time].log`

## Website
Run `website.sh` on a cronjob to update the website's `index.html`, logs are available at `website-[date]_[time].log`

## Clean-up
To clean up the massive amounts of `.log` files produced by the bash scripts, you can run a cronjob.

## Example usage
Below is a full list of commands currently being used by me set via `crontab -e`.

```
*/30 *    * * *    cd /home/ubuntu/Google-Weather-Frog/ && bash weather.sh
*/30 *    * * *    cd /home/ubuntu/Google-Weather-Frog/ && bash scrub.sh
0    0    * * *    cd /home/ubuntu/Google-Weather-Frog/ && bash sync.sh
0    */12 * * *    cd /home/ubuntu/Google-Weather-Frog/ && bash website.sh
0    3    * * SUN  cd /home/ubuntu/Google-Weather-Frog/ && bash cross.sh
0    0    * * SUN  cd /home/ubuntu/Google-Weather-Frog/logs/ && rm *.log
```