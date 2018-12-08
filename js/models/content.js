function ContentModel(content) {
	// content can be either a Submission or a Comment
	// don't forget to add this.replyable_content_type after creation

	// subscribers is a dictionary where the keys
	// correspond to keys in `content`
	// each key contains an array of functions to run
	// if the key in content is modified
	subscribers = {};
	for (const key in content){
		this[key] = content[key];
	}
	this.setLikedStatus();
}
ContentModel.prototype.update = function(newdata){
	for (const key in newdata) {
		const old = this[key];
		this[key] = newdata[key];
		if (key in subscribers && old !== newdata[key]) {
			// let subscribers know about the update
			subscribers[key].forEach(subscriber => subscriber());
		}
	}
};
ContentModel.prototype.addSubscriber = function(key, fn) {
	if (!(key in subscribers)) {
		subscribers[key] = [fn];
		return 0  // index
	} else {
		subscribers[key].push(fn);
		return subscribers[key].length - 1  // index
	}
};
ContentModel.prototype.setLikedStatus = function() {
	if ('likes' in this) {
		if (this.likes) {
			this.liked_status = 'liked';
		} else if (this.likes === null) {
			this.liked_status = 'neutral';
		} else {
			this.liked_status = 'disliked';
		}
	} else {
		// Technically not true b/c the current user could
		// have posted it.
		this.liked_status = 'neutral';
	}
};
