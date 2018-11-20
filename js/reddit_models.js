const DEDUPE_KEY = "Dedupe_URL:";
      URL_STORAGE_KEY = "URL:";
      SUBMISSION_STORAGE_KEY = "Submission:";

const SubmissionCollection = {
    EXPIRATION_TIME: 5,  // minutes
    init: function() {
        $(document).on('url-insert-ids', function(e, newdata) {
            SubmissionCollection.insertIDs(newdata.url, newdata.ids);
            // let front-facing pages know that new submissions were added
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
        let all_ids = lscache.get(URL_STORAGE_KEY + url);
        if (all_ids) {
            ID_array.forEach(function(id) {
                if (all_ids.indexOf(id) < 0) {
                    all_ids.push(id);
                }
            });
            SubmissionCollection.replace(url, all_ids);
        } else {
            SubmissionCollection.replace(url, new_ids);
        }
    },
    get: function(url) {
        const ids = lscache.get(URL_STORAGE_KEY + url);
        const posts = ids ? ids.map(id => lscache.get(SUBMISSION_STORAGE_KEY + id)) : null;
        return posts;
    }
};

const SubmissionModel = {
    EXPIRATION_TIME: 5,  // minutes
    init: function() {
        $(document).on('submission-update', function(e, submissions) {
            // let front-facing pages know that submission was updated
        });
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
    }
};

SubmissionCollection.init();
SubmissionModel.init();
