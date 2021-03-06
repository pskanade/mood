const form = document.getElementById("vote-form");

// form submit event
form.addEventListener("submit", e => {
    const choice = document.querySelector("input[name=music]:checked").value;
    const data = { music: choice };

    fetch("http://localhost:3000/poll", {
        method: "post",
        body: JSON.stringify(data),
        headers: new Headers({
            "Content-Type": "application/json"
        })
    })
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(err => console.log(err));
    e.preventDefault();
});

fetch("http://localhost:3000/poll")
    .then(res => res.json())
    .then(data => {
        const votes = data.votes;
        const totalVotes = votes.length;
        // Count vote points
        const voteCounts = votes.reduce(
            (acc, vote) => (
                (acc[vote.music] =
                    (acc[vote.music] || 0) + parseInt(vote.points)),
                acc
            ),
            {}
        );
        // console.log(votes);
        let dataPoints = [
            { label: "ROCK", y: voteCounts.ROCK },
            { label: "CLASSICAL", y: voteCounts.CLASSICAL },
            { label: "JAZZ", y: voteCounts.JAZZ },
            { label: "BOLLYWOOD", y: voteCounts.BOLLYWOOD }
        ];
        // console.log(dataPoints);
        const chartContainer = document.querySelector("#chartContainer");

        if (chartContainer) {
            const chart = new CanvasJS.Chart("chartContainer", {
                animationEnabled: true,
                theam: "theam1",
                title: {
                    text: `Total Votes : ${totalVotes}`
                },
                data: [
                    {
                        type: "column",
                        dataPoints: dataPoints
                    }
                ]
            });
            chart.render();

            // Enable pusher logging - don't include this in production
            Pusher.logToConsole = true;

            var pusher = new Pusher("919aab7600038be27360", {
                cluster: "ap2",
                encrypted: true
            });

            var channel = pusher.subscribe("music-poll");
            channel.bind("music-vote", function(data) {
                dataPoints = dataPoints.map(x => {
                    if (x.label == data.music) {
                        x.y += data.points;
                        return x;
                    } else {
                        return x;
                    }
                });
                chart.render();
            });
        }
    });
