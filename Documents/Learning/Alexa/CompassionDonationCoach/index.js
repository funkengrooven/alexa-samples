/**
 * This is a sample Lambda function for handling an Alexa skill using NodeJS 6.10.  The focus is to create a multi-step 
 * dialog with Alexa and is paired with the Compassion Confluence article on building your first alexa skill found
 * here: https://cc.ci.org/display/AR/Building+Your+First+Alexa+Skill
 * Here is the general pattern for the dialog
 * User: I want to give to Compassion 
 * Alexa: Thats great, how much would you like to give?
 * User: (optional) Help 
 * Alexa: You can provide an amount you would like to donate or say exit ... Which would you like to do?
 * User: I want to give fifty dollars
 * Alexa: Thank you for your generous gift of 50 dollars
 **/
 
'use strict';

/**
 * Learning Log
 * 1.  Alexa is verbal so when you are using the test tool you need to use the word for the number (fifty not 50)
 * 2.  When using languageStrings below you need to add it as a resource for alexa object in the exports.handler otherwise the handlers wont understand it
 * 3.  When working with Lamba saving the filed does not automatically save the function you need to click the orange save button in the upper right corner
 * 4.  
 **/
 
// Create Alexa object from alexa sdk version 1
const Alexa = require('alexa-sdk');
const APP_ID = 'amzn1.ask.skill.b03ae626-8fd1-450f-b1a4-52478d1edb83'; //this you can copy from the Alexa Skil Kit

//provide key messages in a way that allows for multiple language translations. 
//TODO: create with a second language
const languageStrings = {
    'en-US': {
        translation: {
            GREETINGS: [ // providing a collection of responses allows for a random response to invocation
                'That is great, how much would you like to give?',
                'Awesome, how much would you like to give?',
                'You are very generous, how much would you like to give?'
                ],
                SKILL_NAME: 'Compassion Donation Coach',
                HELP_MESSAGE: 'You can provide an amount you would like to donate or say exit ... Which would you like to do?',
                HELP_REPROMPT: 'Would you like to say a donation amount or exit?',
                STOP_MESSAGE: 'Thank you for considering Compassion, goodbye!',
        },
    },
};

exports.handler = (event, context, callback) => {
    const alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    alexa.resources = languageStrings;
    alexa.appId = APP_ID;
    alexa.execute();
};

//the handlers allow each intent to be handled specifically and provide dialog back to the request.
const handlers = {
    //the LaunchRequest is the handler for the Invocation
    'LaunchRequest': function() {
        const greetingArray = this.t('GREETINGS');
        const greetingIndex = Math.floor(Math.random() * greetingArray.length);
        this.emit(':ask',greetingArray[greetingIndex]);
    },
    //Provide a handler for each specfic intent in your application
    'donationIntent': function() {
        const donationAmount = this.event.request.intent.slots.donationAmount.value;
        this.emit(':tell', 'Thank you for your generous gift of ' + donationAmount + ' dollars!');
        //this.emit(':tell','Donation Intent');
    },
    //Provide a handler for the Amazon predefined intents such as HELP
    'AMAZON.HelpIntent': function() {
        const speechOutput = this.t('HELP_MESSAGE');
        const reprompt = this.t('HELP_REPROMPT');
        this.emit(':ask',speechOutput,reprompt);
    },
    'AMAZON.CancelIntent': function() {
        this.emit(':tell', this.languageStrings.translation('STOP_MESSAGE'));
    },
    'AMAZON.StopIntent': function() {
        this.emit(':tell', this.languageStrings.translation('STOP_MESSAGE'));
    },
    //The Unhandled Intent catches utterances that are not tied to an intent. 
    'Unhandled': function() {
       this.emit(':tell','unhandled');
    }
};
