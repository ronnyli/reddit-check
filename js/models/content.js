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
}
ContentModel.prototype.update = function(newdata){
	for (const key in newdata) {
		this[key] = newdata[key];
		if (key in subscribers) {
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
ContentModel.prototype.getLikedStatus = function() {
        if ('likes' in this) {
            if (this.likes) {
                return 'liked'
            } else if (this.likes === null) {
                return 'neutral'
            } else {
                return 'disliked'
            }
        } else {
            if (this.is_self) {
                return 'liked'
            }
        }
        return 'neutral'
    }
