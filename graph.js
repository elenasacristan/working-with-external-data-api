var vehiclesData = "https://swapi.co/api/vehicles/"

function makeGraph(error, vehiclesData) {

    var ndx = crossfilter(vehiclesData);

    //we will loop throught each item in the salary and convert it to integer
    vehiclesData.forEach(function(d) {
        d.crew = parseInt(d.crew);
       // d.yrs_service = parseInt(d['yrs.service']);
        //d.yrs_phd = parseInt(d['yrs.since.phd']);

    });

console.log(vehiclesData)
   // disciplineSelector(ndx);

    show_percent_per_manufacturer(ndx, "Kuat Dri", "#percentaje-Kuat");
    show_percent_per_manufacturer(ndx, "Sienar F", "#percentaje-Sienar");

   /* genderBalance(ndx);
    showAverageSalaryGender(ndx);
    showRankByGender(ndx);
    show_service_to_salary_correlation(ndx);
    show_phd_to_salary_correlation(ndx);*/



    dc.renderAll()

}

/*function disciplineSelector(ndx) {
    var dim = ndx.dimension(dc.pluck('discipline'));
    var group = dim.group();

    dc.selectMenu('#discipline_selector')
        .dimension(dim)
        .group(group);
}



function genderBalance(ndx) {

    var dim = ndx.dimension(dc.pluck('sex'));
    var group = dim.group();

    dc.barChart('#gender_balance')
        .width(350)
        .height(250)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .dimension(dim)
        .group(group)
        .transitionDuration(1500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel('Gender')
        .yAxis().ticks(20);

}

function showAverageSalaryGender(ndx) {


    var dim = ndx.dimension(dc.pluck('sex'));

    function addItem(p, v) { // p is an acumulator that keeps track of total, count and average and v represents each of the data items that we are adding
        p.count++;
        p.total += v.salary;
        p.average = p.total / p.count;
        return p;
    }

    function removeItem(p, v) {
        p.count--;
        if (p.count == 0) {
            p.total = 0;
            p.average = 0;
        }
        else {
            p.total -= v.salary;
            p.average = p.total / p.count;
        }
        return p;
    }

    function initiliseItem() {
        return { count: 0, total: 0, average: 0 };
    }


    //when we use cumtom reduce we can use anonymous functions inline inside the recuce brackets or use out side functions as we did in this case
    var averageSalaryByGender = dim.group().reduce(addItem, removeItem, initiliseItem);

    //console.log(averageSalaryByGender.all());

    dc.barChart('#average_salary_by_gender')
        .width(350)
        .height(250)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .dimension(dim)
        .group(averageSalaryByGender)
        .x(d3.scale.ordinal())
        .valueAccessor(function(d) {
            return d.value.average.toFixed(2); // toFixed(2) is to only display 2 decimals
        })
        .transitionDuration(1500)
        .xUnits(dc.units.ordinal)
        .elasticY(true)
        .xAxisLabel('Gender')
        .yAxis().ticks(4);

}

function showRankByGender(ndx) {



    function countByRank(dim, rank) {
        return dim.group().reduce(

            function(p, v) {
                p.total++;
                if (v.rank == rank) {
                    p.match++;
                }
                return p;
            },

            function(p, v) {
                p.total--;
                if (v.rank == rank) {
                    p.match--;
                }
                return p;
            },

            function() {
                return { total: 0, match: 0 };
            }
        );
    }

    var dim = ndx.dimension(dc.pluck('sex'));
    var Prof_by_gender = countByRank(dim, 'Prof');
    var AsstProf_by_gender = countByRank(dim, 'AsstProf');
    var AssocProf_by_gender = countByRank(dim, 'AssocProf');


    //console.log(Prof_by_gender.all());
    //console.log(AssocProf_by_gender.all());
    //console.log(AsstProf_by_gender.all());


    dc.barChart('#rank_by_gender')
        .width(350)
        .height(250)
        .dimension(dim)
        .group(Prof_by_gender, "Prof")
        .stack(AsstProf_by_gender, "Asst Prof")
        .stack(AssocProf_by_gender, "Assoc Prof")
        .valueAccessor(function(d) {
            if (d.value.total > 0) {
                return (d.value.match / d.value.total) * 100;
            }
            else {
                return 0;
            }
        })

        .x(d3.scale.ordinal())
        .xAxisLabel("Gender")
        .xUnits(dc.units.ordinal)
        .legend(dc.legend().x(320).y(20).itemHeight(15).gap(5))
        .margins({ top: 10, right: 100, bottom: 30, left: 30 });
}

function show_percent_that_are_professors(ndx, gender, element) {

    var percentageOfProfessors = ndx.groupAll().reduce(
        function(p, v) {
            if (v.sex === gender) {
                p.count++;
                if (v.rank == "Prof")
                    p.are_prof++;
            }
            return p;
        },

        function(p, v) {
            if (v.sex === gender) {
                p.count--;
                if (v.rank == "Prof")
                    p.are_prof--;
            }
            return p;
        },
        function() {
            return { count: 0, are_prof: 0 };
        }
    );

    dc.numberDisplay(element)
        .formatNumber(d3.format('.2%'))
        .valueAccessor(function(d) {
            if (d.count == 0) {
                return 0;
            }
            else {
                return (d.are_prof / d.count);
            }
        })
        .group(percentageOfProfessors);
}


function show_service_to_salary_correlation(ndx) {
    var eDim = ndx.dimension(dc.pluck("yrs_service"));
    var experienceDim = ndx.dimension(function(d) {
        return [d.yrs_service, d.salary, d.sex, d.rank]; //key[0], key[1], key[2], key[3]
    });
    var experienceSalaryGroup = experienceDim.group();

    var genderColors = d3.scale.ordinal()
        .domain(["Female", "Male"])
        .range(["pink", "blue"]);

    var minExperience = eDim.bottom(1)[0].yrs_service;
    var maxExperience = eDim.top(1)[0].yrs_service;

    dc.scatterPlot("#service-salary")
        .width(800)
        .height(400)
        .x(d3.scale.linear().domain([minExperience, maxExperience]))
        .brushOn(false)
        .symbolSize(8)
        .clipPadding(10)
        .xAxisLabel("Years Of Service")
        .yAxisLabel("Salary")
        .colorAccessor(function(d) {
            return d.key[2];
        })
        .colors(genderColors)

        .title(function(d) {
            return d.key[3] + " earned " + d.key[1];
        })
        .dimension(experienceDim)
        .group(experienceSalaryGroup)
        .margins({ top: 10, right: 50, bottom: 75, left: 75 });
}


function show_phd_to_salary_correlation(ndx) {
    var pDim = ndx.dimension(dc.pluck("yrs_phd"));
    var phdDim = ndx.dimension(function(d) {
        return [d.yrs_phd, d.salary, d.sex, d.rank]; //key[0], key[1], key[2], key[3]
    });
    var phdSalaryGroup = phdDim.group();

    var genderColors = d3.scale.ordinal()
        .domain(["Female", "Male"])
        .range(["pink", "blue"]);

    var minPhd = pDim.bottom(1)[0].yrs_phd;
    var maxPhd = pDim.top(1)[0].yrs_phd;

    dc.scatterPlot("#phd-salary")
        .width(800)
        .height(400)
        .x(d3.scale.linear().domain([minPhd, maxPhd]))
        .brushOn(false)
        .symbolSize(8)
        .clipPadding(10)
        .xAxisLabel("Years since PhD")
        .yAxisLabel("Salary")

        .colorAccessor(function(d) {
            return d.key[2];
        })
        .colors(genderColors)

        .title(function(d) {
            return d.key[0] + " years since Phd and earns " + d.key[1];
        })
        .dimension(phdDim)
        .group(phdSalaryGroup)
        .margins({ top: 10, right: 50, bottom: 75, left: 75 });
}
*/