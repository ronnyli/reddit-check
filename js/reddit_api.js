function getBatchIds(all_ids) {
    let unique_ids = [...new Set(all_ids)];
    let batch_ids = [];
    let promises = [];
    while (unique_ids.length > 0) {
        batch_ids.push(unique_ids.shift());
        if (unique_ids.length == 0 || batch_ids.length >= 100) {
            const ids_str = batch_ids.join(',');
            batch_ids = [];
            promises.push(
                fetch('https://api.reddit.com/api/info.json?id=' + ids_str)
                .then(response => response.json())
                .then(resp => resp.data.children)
                .then(listing => {
                    if (listing.length > 0) {
                        return listing.map(elem => elem.data);
                    } else {
                        return [];
                    }
                })
                .catch(error => {
                    console.error(error);
                    return [];
                })
            );
        }
        if (unique_ids.length == 0) {
            return Promise.all(promises)
                .then(values => [].concat.apply([], values));
        }
    }
}

module.exports = {
    getBatchIds: getBatchIds
};
