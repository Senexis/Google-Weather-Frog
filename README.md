# Google Weather Frog
An automatic scrubber of Google Weather's frog images for personal use.

## Commands
| Command         | Description                                            | Logged to                   |
| :-------------- | :----------------------------------------------------- | :-------------------------- |
| `cross.sh`      | Cross-sync all image types and names.                  | `cross-[date]_[time].log`   |
| `scrub.sh`      | Grab the latest images.                                | `scrub-[date]_[time].log`   |
| `sync.sh`       | Get the corresponding missing wides and/or squares.    | `sync-[date]_[time].log`    |
| `weather.sh`    | Update pre-defined location weather images.            | `weather-[date]_[time].log` |
| `website.sh`    | Update the website's `index.html`.                     | `website-[date]_[time].log` |

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