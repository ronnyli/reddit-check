const DEDUPE_KEY = "Dedupe_URL:";
      URL_STORAGE_KEY = "URL:";
      SUBMISSION_STORAGE_KEY = "Submission:";

/*Methods to interact with Submission Collections in lscache*/
const SubmissionCollectionLscache = {
    EXPIRATION_TIME: 5,  // minutes
    init: function() {
        let this_ = this;
        $(document).on('url-insert-ids', function(e, newdata) {
            this_.insertIDs(newdata.url, newdata.ids);
        });
    },
    replace: function(url, ids) {
        lscache.set(
            URL_STORAGE_KEY + url,
            typeof ids === "string"? [ids] : ids,
            this.EXPIRATION_TIME);
            $(document).trigger('url-replace', {
                url: url,
                ids: ids
            });
    },
    insertIDs: function(url, new_ids) {
        const ID_array = typeof new_ids === "string"? [new_ids] : new_ids;
        let all_ids = lscache.get(URL_STORAGE_KEY + url) || [];
        ID_array.forEach(function(id) {
            if (all_ids.indexOf(id) < 0) {
                all_ids.push(id);
            }
        });
        this.replace(url, all_ids);
    },
    get: function(url) {
        const ids = lscache.get(URL_STORAGE_KEY + url);
        const posts = ids ? ids.map(id => lscache.get(SUBMISSION_STORAGE_KEY + id)) : null;
        return posts.filter(post => post);
    }
};

/*Methods to interact with Submissions in lscache*/
const SubmissionLscache = {
    EXPIRATION_TIME: 5,  // minutes
    get: function(id) {
        const id_ = id.includes('_') ? id.split('_')[1] : id;
        return lscache.get(SUBMISSION_STORAGE_KEY + id_);
    },
    insert: function(submissions, url) {
        submissions.forEach(function(submission) {
            lscache.set(
                SUBMISSION_STORAGE_KEY + submission.id,
                submission,
                this.EXPIRATION_TIME
            );
        })
        $(document).trigger('url-insert-ids', {
            url: url,
            ids: submissions.map(submission => submission.id)
        });
    },
    delete: function(id) {
        lscache.remove(SUBMISSION_STORAGE_KEY + id);
    },
    update: function(submissions) {
        submissions.forEach(function(submission) {
            lscache.set(
                SUBMISSION_STORAGE_KEY + submission.id,
                submission,
                this.EXPIRATION_TIME
            );
        });
        $(document).trigger('submission-update', {
            submissions: submissions
        });
    },
    updateComment: function(submission, comment_id, newdata) {
        const id_ = comment_id.includes('_') ? comment_id.split('_')[1] : comment_id;
        function updateRecursive(entry) {
            if (entry.id === id_) {
                Object.assign(entry, newdata);
                return true;
            } else {
                return entry.replies.filter(updateRecursive);
            }
        }
        submission.comments.filter(updateRecursive);
        this.update([submission]);
    }
};

SubmissionCollectionLscache.init();
