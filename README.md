#GroupMe Bot
Currently using a custom fork of the npm fancy-groupme-bot, from here: <https://www.npmjs.com/package/fancy-groupme-bot>
fork is at <https://github.com/CB-27/fancy-groupme-bot>

#GroupMe Info

Groups IDs:
    Wild Wild Wes: 9674073 
    BotTest:       12717380


#Current Status
Bot can read and repeat images and text. It can also save images for manipulation and upload them after
Repeating of text is disabled now, however

##Possible future uses
    * Have a keyword to trigger manipulation of the next image
    * Randomly manipulate every image

#Build Info
##DO NOT INCLUDE node_modules for heroku, it won't work
You can run <pre><code>$npm install</pre></code> if you want to try things locally, though it might not work
Heroku also functions as a git repo, and will install node_modules