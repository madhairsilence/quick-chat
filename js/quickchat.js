//Load default values
var _defaults = {
    title : 'Friendly Chat',
    description : 'Chat description',
    sender : 'Harish',
    messages : messages
};

//Store all templates
var Template = {

  container : '<div class="chat-container"> Container </div>',
  header    :  '<div class="chat-header">'+
                  '<div class="chat-title"> ##title## </div>'+
                  '<div class="chat-desc"> ##description## </div>'+
                '</div>',
  messageListContainer : '<ul class="chat-messages">',
  quoteMessage :   '<div class="chat-qpreview-label"> Quoted </div>'+
                    '<div class="chat-qmessage">##quoteMessage##</div>' ,
  quotePreview : '<div class="chat-qpreview-label"> Quoted </div>'+
                  '<div class="chat-qpreview">##quoteMessage##</div class="chat-qpreview">',
  messageContainer   : '<li></li>',
  message :   '<div class="chat-sender">##sender##</div>' +
              '<div class="chat-time">##time##</div>'+
              '<div class="chat-message">##message##</div>',
  replyButton : '<div class="reply-button">Reply</div>',
  messageInputContainer : '<div class="chat-new"></div>',
  messageInput : '<textarea class="chat-input"></textarea>',
  sendButton  : '<div class="send-button"> Send </div>',

  get : function ( templateKey ){
    return this[ templateKey ];
  },

  format : function( templateKey , data ) {
      var template  = this.get( templateKey );
      Object.keys(data).forEach( function(key ) {
          if( data[ key ])
          template = template.replace( '##'+key+'##', data[ key ] );
      });

      return template;
  }

}

var ChatUI = {

    create : function ( element, options ) {

        this.element = Utils.findElement( element );

        if(  this.element == null || this.element.length == 0 ){
          console.error( 'No Element to install plugin ');
        }

        if( options ){
          this.options  = $.extend( _defaults, options ); //Mergin user options with defaults
        }
        else{
          this.options = _defaults;
        }

        this.buildChatUI();

        //Return the chat Instance
        return this;
    },

    //Build the main container
    buildContainer : function()  {
        this.container = $( Template.get('container') );
    },

    //Build Chat Header
    buildHeader : function(  ){
      this.header = $( Template.format ('header' , { title : this.get('title'), description : this.get('description') } ) );
    },

    //Build chat messages
    buildMessages : function( ){
        var temp = '';
        var _this = this;
        this.messageListContainer = $( Template.get('messageListContainer') );

        this.get('messages').forEach( function(message, index)  {
            if( !message.id ){
                message.id = index;
            }
            temp = _this.addMessage( message ) ;
        });

        this.messageListContainer.append( temp );
    },

    //Method to add New Messages
    addMessage : function( message ){

       var _this = this;
       var messageContainer = $( Template.get('messageContainer') );

       var replyAction = $( Template.get( 'replyButton' ) );
       replyAction.on('click', function(){
         _this.addQuoteMessage( message.message );
       });

       if( message.quoteMessage
            && message.quoteMessage.trim() != ''
            && message.quoteMessage.length != 0)
       {
        messageContainer.append( Template.format('quoteMessage', { quoteMessage : message.quoteMessage} ) )
       }
       messageContainer
            .append( Template.format('message', { sender : message.sender, message : message.message, time : Utils.getTime( message.time )} ) )
            .append(replyAction);

      this.messageListContainer
        .append(messageContainer)
    },

    //Message Input Box
    buildMessageInput : function(){
        var _this = this;

        this.inputContainer = $( Template.get('messageInputContainer'));

        var messageInput = $( Template.get('messageInput') );
        var sendButton = $( Template.get('sendButton') );
        sendButton.on('click', function(){

            if( _this.options.addAction ){
                  _this.options.addAction(function() { //Call the custom ADD method provided by  user
                      _this.addMessage({ sender : 'MySelf',
                          message : Utils.findInput().val(),
                          quoteMessage : Utils.findQuoteMessage().html(),
                          time : new Date()
                        });
                  });
          }
          else{
            _this.addMessage({ sender : 'MySelf',
                message : Utils.findInput().val(),
                quoteMessage : Utils.findQuoteMessage().html(),
                  time : Utils.getTime()
              });
          }
          Utils.findInput().val('')
          Utils.findQuoteMessage().remove();
        });

        this.inputContainer
                .append( messageInput )
                .append( sendButton );
    },

    //Add Quote message above Input field
    addQuoteMessage : function(message){
        if( Utils.findQuoteMessage() == null || Utils.findQuoteMessage().length ==0 ){
            Utils.findInput().parent().prepend( Template.format('quotePreview', { quoteMessage : message }) );
        }
        else{
          Utils.findQuoteMessage().html( message );
        }
    },

    //Put all pieces together
    buildChatUI : function(){

        this.buildContainer();
        this.buildHeader();
        this.buildMessages();
        this.buildMessageInput();

        this.container.html('')
            .append( this.header )
            .append( this.messageListContainer )
            .append( this.inputContainer );

        this.element.append( this.container );

    },

    get : function ( key ){
      return this.options[key];
    },

}


//Utility Funcions
var Utils = {
    findElement : function( param ) {
        return $( param ) ;
    },

    findInput : function() {
        return $('.chat-input');
    },

    findQuoteMessage : function() {
        return $('.chat-qpreview');
    },

    getTime : function( time ) {
        var timeString = '';
        var time;
        var today = new Date();
        if(time){
            time = new Date( time );
        }
        else{
          time =today;
        }

        if(time &&
          time.getDate() == today.getDate() &&
          time.getMonth() == today.getMonth() &&
          time.getFullYear() == today.getFullYear())
        {
            timeString= 'Today , ';
        }
        else{
          timeString = time.getDate() + '-' + (time.getMonth()+1) +'-'+ time.getFullYear()+' , ';
        }

        timeString = timeString.concat( time.getHours()+':'+time.getMinutes()+':'+time.getSeconds())

        return timeString;
    }

};
