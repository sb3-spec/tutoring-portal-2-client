function dateFormatting(dateString) {
    let date = new Date(dateString);

    let months = [
        'Jan.', 'Feb.', 'Mar.', 'Apr.', 'May.', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'
    ];

    return `${months[date.getMonth()]} ${date.getDate() + 1}, ${date.getFullYear()}`;
}

function clientNameToUUID(clients) {
    let clientNames = {};
    for (let client of clients) {
        clientNames[client.uuid] = client.name
    };

    return clientNames;
};

function getSum(dues) {
    let sum = 0;
    for (let client of Object.keys(dues)) {
        sum += dues[client];
    }
    
    return sum;
}

function getOwedByClient(sessions, clientNames) {
    let clientDues = {};
    
    for (let session of sessions) {
        if (Object.keys(clientDues).includes(clientNames[session.clientUuid])) {
            clientDues[clientNames[session.clientUuid]] += session.payout;
        } else {
            clientDues[clientNames[session.clientUuid]] = session.payout;
        } 
    }
    
    return clientDues;
};

module.exports = {
    dateFormatting,
    clientNameToUUID,
    getSum,
    getOwedByClient
}
