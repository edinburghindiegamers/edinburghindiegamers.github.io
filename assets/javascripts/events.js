const EVENTS_URL = 'http://eig.vsnt.uk/get_guild_events/'
const EVENTS_LISTING = document.getElementsByClassName('events-listing')[0]
const request = new XMLHttpRequest()

function parse_response(response) {
    var json = JSON.parse(response)
    return json
}

function construct_output(json) {
    var output = ''
    var time_format = {
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short',

    }
    for (let i = 0; i < json.length; i++) {
        var start_time = new Date(Date.parse(json[i].scheduled_start_time))
        var end_time = new Date(Date.parse(json[i].scheduled_end_time))
        output += `
<li>
    <h3 class='event-title' id='event-${i}'>${json[i].name}</h3>
    <strong>${start_time.toLocaleDateString('en-GB', { dateStyle: 'full' })} <br></strong>
    <hr>
    <p>
        <strong>Start</strong>: ${start_time.toLocaleTimeString('en-GB', time_format)} <br>
        <strong>End</strong>: ${end_time.toLocaleTimeString('en-GB', time_format)} <br>
        <strong>Venue</strong>: ${json[i].entity_metadata.location}
    </p>
</li>`
    }
    output = `<ul>
    ${output}
    </ul>`
    return output
}

request.addEventListener('readystatechange', () => {
    if (request.readyState === 4) {
        if (request.status === 200) {
            var json = parse_response(request.responseText)
            if (json.length > 0) {
                EVENTS_LISTING.innerHTML = construct_output(json)
            } else {
                EVENTS_LISTING.innerHTML = `
                <div class='admonition info'>
                    <p class='admonition-title'>No Events Currently Scheduled</p>
                    <p>There are currently no events scheduled. You can always check back here later or join our Discord to stay up to date with any information</p>
                </div>
                `
            }
        } else {
            EVENTS_LISTING.innerHTML = `
            <div class='admonition failure'>
                <p class='admonition-title'>Error Fetching Events</p>
                <p>There was an error fetching events from the server. Please check back here later or join our Discord to stay up to date with events.</p>
            </div>`
        }
    }
})

request.open(method='GET', url=EVENTS_URL)
request.send()