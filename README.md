# EmojiChat

A description of the project and the intended experience + your motivation and process for creating it 

Emoji Chat is a commentary on the representativeness (or lack thereof) of Emoji’s, and the role that emoji’s play in our everyday conversations. Emojis or emoticons are supposed to be representative of our emotions, however, emotions are complex and ever-changing, so what are the consequences of having a finite set of options for expressing yourself and your emotions or ideas. 

The user should connect to the page and wait to be connected to another random user. The two users will get a randomly generated topic of discussion, and they should attempt to only discuss the topic using Emojis. Users can also choose to press ‘Read a random conversation’ to read a randomly generated conversation that another user submitted to the database. 

The most interesting part of my user testing and during the Interactive Media showcase was watching people interact with the chat and attempt to interpret the stories of others. When two people were side by side, they would turn to each other and talk about what they think the other’s message meant. This reminded me that often times when we are using something like Emoji’s in our messages to communicate, we do not have the luxury of face to face conversation to clarify or truly understand what the other person is saying. I also noticed that people were not really using the skin tone selection feature, which is interesting given that the skin tones are supposed to allow people to more accurately ‘represent themselves’. 

Explanation of the design decisions

I want a simple interface that is nostalgic of instant messaging applications, so I made a chat box that took up the majority of the page. I was not able to disable the text box completely to not allow users to type messages (I also would like for people to be able to discuss the implications of their conversation in case the users are not actually face to face). 

Working with Sockets.io was useful for figuring out how to transmit messages, but the most difficult part was connecting with a random user and allowing more than two users to be using the website at one time and pairing any new users that get to the page. I used a JS Snow library and replaced the snow with an Emoji image to add a whimsical effect on the page. 

https://emoji-randomchat.herokuapp.com/api/all is a route that returns all of the image data in the database. 

Major Challenges

Saving the div to a gallery proved to be a challenge. I was able to use a function called html2canvas, which turn the selected div into a canvas which I then encoded and stored to the database. I was happy with the ability to store the canvas as encoded text so that I wouldn’t have to store image files to the Cloudant database, however, the html2canvas function does not recognize images or special characters within div’s (which means Emoji’s don’t actually show up on the page). 

Possible Next Steps 

It is somewhat mobile friendly right now, but the experience isn’t as beautiful looking as the desktop. I think that this experience would be most seamless on a mobile phone since people tend to use Emoji’s when they are using their phones. 

I also need to find a way to save the div along with the Emoji’s to save to the database. I could have chosen to let the user screenshot and upload an image, but I didn’t feel that it was a seamless experience that the user would want to partake in. 

Resources

http://www.schillmania.com/projects/snowstorm/
https://blog.bufferapp.com/social-media-language
https://www.dailydot.com/irl/skin-tone-emoji/



