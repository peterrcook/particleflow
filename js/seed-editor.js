var drag = d3.drag()
    .on('drag', handleDrag)
    .on('end', handleEnd);

var dragArrow = d3.drag()
    .subject(function(d) {
        // Make drag subject the arrow (see D3 docs for more detail)
        // Without this, d3.event.x returns values as though the
        // centre is being dragged
        return {
            x: d.x + d.vx,
            y: d.y + d.vy
        };
    })
    .on('drag', handleDragArrow)
    .on('end', handleEndArrow);

function handleDrag(d) {
    d.x = d3.event.x;
    d.y = d3.event.y;
    updateSeeds();
}

function handleEnd() {
    pf.setSeeds(seeds);
}

function handleDragArrow(d) {
    var dx = d3.event.x - d.x;
    var dy = d3.event.y - d.y;

    d.vx = dx;
    d.vy = dy;

    updateSeeds();
}

function handleEndArrow() {
    pf.setSeeds(seeds);
}

function updateSeedCentres() {
    d3.select('svg#seeds')
        .selectAll('path.main')
        .data(seeds)
        .join('path')
        .classed('main', true)
        .attr('transform', function(d) {
            return 'translate(' + d.x + ',' + d.y + ')';
        })
        .attr('d', seedPath)
        .call(drag);
}

function updateSeedArrows() {
    console.log('ends');
    d3.select('svg#seeds')
        .selectAll('path.arrow')
        .data(seeds)
        .join('path')
        .classed('arrow', true)
        .attr('transform', function(d) {
            var rot = Math.atan2(d.vy, d.vx);
            rot *= 180 / Math.PI;
            var dis = Math.sqrt(d.vx * d.vx + d.vy * d.vy);
            return 'translate(' + (d.x + d.vx) + ',' + (d.y + d.vy) + ')rotate(' + rot + ')';
        })
        .attr('d', 'M0,-5 l8,5 l-8,5 z')
        .call(dragArrow);
}

function updateSeeds() {
    updateSeedCentres();
    updateSeedArrows();
}
