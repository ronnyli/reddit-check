const usefulness = require('../../js/ml/usefulness_score.js');
const lr_test = require('./logistic_regression_test.json');

test('logistic regression matches sklearn', () => {
    lr_test.x.forEach((x, i) => {
        const actual = usefulness.logistic_regression.predict_proba(x);
        const expected = lr_test.y[i];
        expect(actual.toFixed(10)).toEqual(expected.toFixed(10));
    });
});

test('tf counts term frequency', () => {
    const txt = '\n• “controversy” he dressed like a bigtime rapper, so i gave him a rapper name.  \n• “pistol pete”';
    const actual = usefulness.tf(txt);
    const expected = {
        "bigtime": 1, "bigtime rapper": 1, "bigtime rapper gave": 1,
        "controversy": 1, "controversy dressed": 1, "controversy dressed like": 1,
        "dressed": 1, "dressed like": 1, "dressed like bigtime": 1,
        "gave": 1, "gave rapper": 1, "gave rapper pistol": 1,
        "like": 1, "like bigtime": 1, "like bigtime rapper": 1,
        "pete": 1, "pistol": 1, "pistol pete": 1,
        "rapper": 2, "rapper gave": 1, "rapper gave rapper": 1,
        "rapper pistol": 1, "rapper pistol pete": 1
    };
    expect(actual).toEqual(expected);
});

test('tfidf success', () => {
    lr_test.x_raw.forEach((body, i) => {
        const actual = usefulness.tfidf(body).map(el => el.toFixed(10));
        const expected = lr_test.x[i].map(el => el.toFixed(10));
        expect(Math.round(actual.reduce((a, b) => a + Math.pow(b, 2), 0))).toEqual(1);
        expect(actual).toEqual(expected);
    });
});
