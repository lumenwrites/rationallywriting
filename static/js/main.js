var audio;
function playAudio(audioButton) {
    audio = $(audioButton).parent().find("#audio").get(0);
    var playButton = $(audioButton).parent().find(".play");
    var timeline = $(audioButton).parent().find(".timeline");        

	if (audio.paused) {
	    $('audio').each(function(){
		this.pause(); // Stop playing
	    }); 
	    $('.play').each(function(){
		$(this).addClass("fa-play-circle-o");
		$(this).removeClass("fa-pause-circle-o");		
	    }); 

	    audio.play();
	    playButton.addClass("fa-pause-circle-o");
	    playButton.removeClass("fa-play-circle-o");
	    timeUpdate();	    
	    $(".timeline").addClass("hidden");	    	    
	    timeline.removeClass("hidden");	    
	} else { 
	    audio.pause();
	    playButton.addClass("fa-play-circle-o");
	    playButton.removeClass("fa-pause-circle-o");
	    timeUpdate();	    
	    // timeline.addClass("hidden");	    
	}


    // Update time
    audio.addEventListener("timeupdate", timeUpdate, false);
    function timeUpdate() {
	var playPercent = 100 * (audio.currentTime / audio.duration);
	// console.log(playPercent);
	$(".timeline").find(".active").width(playPercent+"%");
	$(".timeline").find(".inactive").width(100-playPercent+"%");		
	// playhead.style.marginLeft = playPercent + "%";
    }

    // Seek
    //Makes timeline clickable
    var seek = $(audioButton).parent().find(".seek");	
    seek.get(0).addEventListener("click", function (event) {
	audio.currentTime = audio.duration * clickPercent(event);
	timeUpdate();
    }, false);
    
    // returns click as decimal (.77) of the total timelineWidth
    function clickPercent(e) {
	var percent =  (e.pageX - seek.offset().left) / seek.width();
	console.log(percent);
	return percent;
    }
    
}

$(document).ready(function() {
    
    jQuery.fn.reverse = [].reverse;
    
    //feed to parse
    var feed = "http://cors.io/?u=http://feeds.soundcloud.com/users/soundcloud:users:235055733/sounds.rss";

    //discussion threads
    var discussions = [
	"https://www.reddit.com/r/rational/comments/4qzlgr/new_podcast_rationally_writing_episode_1_what_is/?ref=search_posts",
	"https://www.reddit.com/r/rational/comments/4s4mez/rationally_writing_episode_0_history/?ref=search_posts",
	"https://www.reddit.com/r/rational/comments/4t5fnu/d_rationally_writing_episode_2_tropes/?ref=search_posts",
	"https://www.reddit.com/r/rational/comments/4ufadm/rationally_writing_episode_3_originality/?ref=search_posts",
	"https://www.reddit.com/r/rational/comments/4vik6y/rationally_writing_episode_4_fanfiction/"
    ]
    
    $.ajax(feed, {
        accepts:{
            xml:"application/rss+xml"
        },
        dataType:"xml",
        success:function(data) {
            $(data).find("item").reverse().each(function (index) { // or "item" or whatever suits your feed
                var el = $(this);
                // console.log("------------------------");
                // console.log("title      : " + el.find("title").text());
                // console.log("link       : " + el.find("link").text());
                // console.log("description: " + el.find("description").text());
                // console.log("download: " + el.find("enclosure").attr("url"));


		var title = el.find("title").text();
		title = index+1 + ". " + title.split("-").pop();
		var link = el.find("link").text();
		var description = el.find("description").text();
		var download = el.find("enclosure").attr("url");

		var discussion = discussions[index];
		var discussionButton = "";
		if (discussion) {
		    discussionButton = `	              
                            <a class="button right fa fa-comments" href="`+discussion+`"
	                    </a>
			`
		} 
		
		$(".episode-list").append(`
	              <article class="callout">

			<a class="button fa fa-play-circle-o play" onclick="playAudio(this);"></a>

	                <audio id="audio" class="hidden" controls="controls">
	                  <source src="`+download+`" type="audio/mpeg" />
	                </audio>	    


                        <a class="button right fa fa-download" href="`+download+`">	    
	                </a>

	              `+discussionButton+`	              
	                
	                <a href="`+ link+`">
	                  <h2> `+ title +` </h2>
	                </a>
	                <p> `+ description+`</p>

	                <div class="timeline hidden">
	                  <div class="exp-timeline">
	                	<div class="container">
	                	  <ul class="items">
	                	    <li class="seek">
	                	      <div class="active" style="width: 30%"></div>
	                	      <div class="inactive" style="width: 70%"></div>
	                	    </li>
	                	  </ul>
	                	</div>
	                  </div>
	                </div>


	              </article>
		  `);
            });
    

        }   
});

});
