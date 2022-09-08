function dateFormatting(dateString) {
    let date = new Date(dateString);

    let months = [
        'Jan.', 'Feb.', 'Mar.', 'Apr.', 'May.', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'
    ];

    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

function clientNameToUUID(clients) {
    let clientNames = {};
    for (let client of clients) {
        clientNames[client.uuid] = client.name
    };

    return clientNames;
};

module.exports = {
    dateFormatting,
    clientNameToUUID
}
