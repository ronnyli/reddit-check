/*
lr_config = {
    intercept: float,
    coef: list of floats
}
*/
const lr_config = require('../../ml/logistic_regression.json');/*
tfidf_config = {
    feature_names: list of strings,
    idf: list of floats (representing IDF vector)
}
*/
const tfidf_config = require('../../ml/tfv.json');
// ENGLISH_STOP_WORDS: list of strings
const ENGLISH_STOP_WORDS = require('../../ml/english_stop_words.json');

function logistic_regression() {
    const intercept = lr_config.intercept;
    const coef = lr_config.coef;
    function model_output(tfv) {
        const weights = coef.map((b, i) => b * tfv[i]).reduce((a,b) => a+b, 0);
        return intercept + weights;
    }
    function predict_proba(tfv) {
        return 1 / (1 + Math.exp(-model_output(tfv)));
    }
    return {
        predict_proba: predict_proba
    }
}

function tfidf(txt) {
    tf_ = tf(txt);
    tfidf_ = [];
    tfidf_config.feature_names.forEach((token, i) => {
        const idf = tfidf_config.idf[i];
        if (tf_.hasOwnProperty(token)) {
            tfidf_.push((1 + Math.log(tf_[token])) * idf);
        } else {
            tfidf_.push(0);
        }
    });
    // l2 norm (sum of squared elements adds up to 1)
    const l2_norm_factor = Math.sqrt(tfidf_.reduce((a, b) => a + Math.pow(b, 2), 0));
    return tfidf_.map(el => el / l2_norm_factor);
} 

function tf(txt) {
    function _word_ngrams(tokens, ngram_range, stop_words) {
        // Turn tokens into a sequence of n-grams after stop words filtering
        // handle stop words
        if (stop_words) {
            let tokens_ = [];
            tokens.map(w => {
                if (stop_words.indexOf(w) === -1) {
                    tokens_.push(w);
                }
                tokens = tokens_;
            });
        }

        // handle token n-grams
        let min_n, max_n;
        [min_n, max_n] = ngram_range;
        if (max_n != 1) {
            const original_tokens = tokens;
            if (min_n == 1) {
                // no need to do any slicing for unigrams
                // just iterate through the original tokens
                tokens = original_tokens;
                min_n += 1;
            }
            else {
                tokens = [];
            }

            const n_original_tokens = original_tokens.length;

            max_n = Math.min(max_n + 1, n_original_tokens + 1);
            [...Array(max_n).keys()].slice(min_n).map(n => {
                [...Array(n_original_tokens - n + 1).keys()].map(i => {
                    tokens.push(original_tokens.slice(i, i + n).join(' '));
                });
            });
        }
        return tokens
    }

    function _count_vocab(tokens) {
        let out = {};
        tokens.forEach(token => {
            if (token in out) {
                out[token] += 1;
            }
            else {
                out[token] = 1;
            }
        });
        return out;
    }

    txt = txt.toString().toLowerCase();
    let tokens = txt.match(/\w{1,}/g);;
    let ngrams = _word_ngrams(tokens, ngram_range=[1, 3], stop_words=ENGLISH_STOP_WORDS);
    let token_count = _count_vocab(ngrams);
    return token_count;
}

exports.logistic_regression = logistic_regression();
exports.tf = tf;
exports.tfidf = tfidf;
