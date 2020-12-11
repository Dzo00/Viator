window.onload = function(){
    WriteMenu();

    if(window.location.href.includes("index.html")){
        WriteCategories();    
        var catEl = document.getElementsByClassName("activity");
        console.log(catEl[0])
        for(let i=0;i<catEl.length;i++){
            catEl[i].addEventListener("click",RemmemberID);
        }
        writePlaces();
        CSS();
        let catDivPos = $("#categories").offset().top;
        console.log(catDivPos);
        $(window).on('scroll',()=> {
            let scroll = $(window).scrollTop();
            console.log(scroll);

            if(scroll<=catDivPos - 290.7){
                $('#categories').css("transform",`translateX(${-2000+scroll*1.8}px)`)
            }
        })
    }
    if(window.location.href.includes("places.html")){
        MakeDDL("placesDDL",places);
    }
    if(window.location.href.includes("activities.html")){
        MakeDDL("activityDDL",categories);
        MakeDDL("placesDDL",places);

        if(localStorage.getItem("ActivityID")!=null || localStorage.getItem("ActivityID")!=""){
            let selectedID =localStorage.getItem("ActivityID");
            //console.log($(`#ddlActivity`)[0].selectedIndex);
            $(`#ddlActivity`)[0].selectedIndex = selectedID;
            writeBoxes("activity",selectedID);            
            localStorage.removeItem("ActivityID");
        }else{
            writeBoxes();      
        }
    }
    
    
}

//
// FUNKCIJE ZA DINAMICKO KREIRANJE I ISPISIVANJE DROPDOWN LISTI I SADRZAJA
//

//ISPIS MENIJA I FUNKCIOANLNOST AKTIVNOG LINKA


// TRENUTNA STRANICA
var url=window.location.href;

function WriteMenu(){
    var ul=document.getElementById('meni');
    for(let i=0; i<meni.length;i++){
        let li = document.createElement("li");
        li.setAttribute("class","col-lg-3 nav-item");
        let a = document.createElement('a');
        a.setAttribute("href",`${meni[i][1]}`);
        let txt = document.createTextNode(`${meni[i][0]}`);
        a.appendChild(txt);
        li.appendChild(a);
        ul.appendChild(li);
    }
    function ActiveLink(){        
        var navLink= document.getElementsByClassName("nav-item");
        for(let i=0; i<navLink.length;i++){
            // console.log(navLink[i].firstChild);
            // console.log(url);
            if(url.search(navLink[i].getAttribute("href"))!=-1){
                // console.log("dsd");
                navLink[i].firstChild().classList.add("active");
            }
        }
    }
    ActiveLink();
}


// ISPIS KATEGORIJA

function WriteCategories(){
    let div = document.getElementById("categories").firstElementChild;
    //console.log(div);
    let txt=``;
    for(let cat of categories){
        txt += `<div class="show-animation col-lg-3 circles">
                <a class="activity" href="activities.html" data-id="${cat.id}">
                    <img src="assets/images/${cat.src}" alt="${cat.alt}"/>
                    <div class="hold"><h4>${cat.name}</h4></div>
                 </a>
            </div>`;
    }
    div.innerHTML=txt;
    var anim = $(".show-animation");
    //console.log(anim);
    for(let el of anim){
        console.log(el);
        el.addEventListener("mouseenter",showActivity);
        el.addEventListener("mouseleave",hideActivity);
    }
}


// ISPIS LOKACIJA

function writePlaces(){
    div1 = document.getElementById('places');
    let style = document.createElement("style");
    let i=0;
    for(let obj of places){
        let divDest = document.createElement("div");
        let h4 = document.createElement("h4");
        let name = document.createTextNode(obj.name); 
        style.innerHTML += `.place${i} {background-image:url("assets/images/${obj.image}");\nbackground-size:cover;\n
        background-repeat:no-repeat;\n}\n`;
        divDest.classList.add("places-box");
        divDest.classList.add(`place${i}`);
        divDest.setAttribute("data-pid",obj.id);
        h4.appendChild(name);
        divDest.appendChild(h4);
        div1.appendChild(divDest);
        divDest.addEventListener("click",function(){
            //alert(this.dataset.pid);
            localStorage.setItem("PlaceID",this.dataset.pid);
            window.location.href="places.html"; 
            //DORADITI OVU FUNKCIONALNOST ZA NOVU STR ;)
        })
        i++;
    }    
    document.getElementsByTagName('head')[0].appendChild(style);
}

//ISPIS DDL U ZAVISNOSTI OD STRINGA KOJI JE PROSLEDJEN

function MakeDDL(string,object){
    console.log(string);
    let options;
    let div;
    if(string.includes('placesDDL')){
        console.log(object)
        options = MakeOptions(object);
        div = document.getElementById("ddlLocation");
        div.innerHTML+=options;
    }
    else if(string.includes('activityDDL')){
        options = MakeOptions(object); 
        div = document.getElementById("ddlActivity");
        div.innerHTML+=options;
        console.log(object)
    }
    else if(string.includes('lodgingDDL')){
        options = MakeOptions(object); 
        div = document.getElementById("ddlAccType");
        div.innerHTML+=options;
        console.log(object)
    }
}


// ISPIS SADRZAJA

function writeBoxes(type,object,selectedID=null){
    let html ="";    
    console.log($('.middle-main'));
    if(selectedID==null){
        if(type=='activity'){
            html=MakeHTML(type,object);
            $('.middle-main').html(html);
        }
        else if(type=='accomodation'){
            html=MakeHTML(type,object);
            $('.middle-main').html(html);
        }
    }else{
        if(type=='activity'){
            object = object.filter(el=> el.id==selectedID);
            html=MakeHTML(type,object);
            $('.middle-main').html(html);
        }
        else if(type=='accomodation'){            
            object = object.filter(el=> el.id==selectedID);
            html=MakeHTML(type,object);
            $('.middle-main').html(html);
        }
    }
}

// KREIRANJE OPTION TAGOVA I KARTICA ZA SADRZAJ

function MakeOptions(object){
    let html = ``;
    for(let obj of object){
        html+= `<option value="${obj.id}">${obj.name}</option>`;
    }
    return html;
}

function MakeHTML(type,object){
    let html =``;
    if(type=='activity'){
        for(let obj of object){
            html += `
            <div class="card">
                <img class="card-img-top" src="assets/images/${obj.src}" alt="${obj.alt}">
                <div class="card-body">
                    <h5 class="card-title font-weight-bold text-uppercase">${obj.name}</h5>
                    <p class="card-text font-weight-normal my-2">Before or after you venture into the redwoods, Old Town Eureka is a must-see.  Restaurants, galleries, theaters, coffee houses, boardwalks and antique shops make up only a portion of everything this cozy quaint V…</p>
                    <a href="#" data-id="${obj.id}" class="h6 black mt-3 d-block text-black font-weight-bold">Learn more</a>
                </div>
                <div class="card-footer w-100 p-0 h-10 d-flex justify-content-evenly">
                    <div class="py-3 h-100 align-items-center col-6 text-center font-weight-bold"><a href="${obj.directions}"><p>Get directions</p></a></div>
                    <div data-id="${obj.id}" class="suitcase py-3 col-6 bg-black d-flex align-items-center"><span class="font-weight-bold"><i class="fas fa-suitcase-rolling mx-2"></i>Add to suitcase</span></div>
                </div>
            </div>
            `;
        }
        return html;
    }
    else if(type=="accomodation"){
        for(let obj of object){
            html +=`
                <div class="card">
                    <img class="card-img-top" src="assets/images/${obj.src}" alt="${obj.alt}">
                    <div class="card-body">
                        <h5 class="card-title font-weight-bold">${obj.name}</h5>
                        <div class="d-flex justify-content-evenly px-3">
                            <p class="card-text font-weight-normal text-wrap col-6">${obj.address}</p>
                            <div class="col-4">
                                <a href="${obj.directions}"><p class="direction-link card-text font-weight-bold" data-id="">Directions</p></a>
                                <p class="card-text font-weight-normal">${obj.number}</p>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer w-100 p-0 h-15 d-flex justify-content-evenly">
                        <div class="align-items-center col-6 d-flex justify-content-center text-center font-weight-bold">FROM <span class="mx-2">$${obj.price}</span></div>
                        <div data-id="${obj.id}" class="suitcase col-6 bg-black d-flex align-items-center"><span class="font-weight-bold" data-id=""><i class="fas fa-suitcase-rolling mx-2"></i>Add to suitcase</span></div>
                    </div>
                </div>
            `;
        }
        return html;
    }
}

// JS OBJEKTI
// DDL SADRZAJ SE UZIMA IZ JS OBJEKATA

var meni = [["Things to do","activities.html"],["Places to stay","places.html"],["Discover the country","explore.html"],["My Suitcase","suitcase.html"]];


var categories = [{"id":1,"name":"Redwoods","alt":"redwood forest","src":"Redwood.jpg"},{"id":2,"name":"Beaches","alt":"cloudy beach coast","src":"beach.jpg"},{"id":3,"name":"Hiking","alt":"hiking road","src":"hiking.png"},{"id":4,"name":"Water activities","alt":"people rafting","src":"wact.jpg"},{"id":5,"name":"Leisure","alt":"cycling break coast","src":"leisure.jpg"},{"id":6,"name":"Towns","alt":"town","src":"towns.jpg"},{"id":7,"name":"History","alt":"redwood tree","src":"historical.jpg"},{"id":8,"name":"Tours/Guides","alt":"road","src":"tour.jpg"}];

var places = [
    {
        "id":1,
        "name":"Eureka",
        "description": ["Tucked just inland of Humboldt Bay, Eureka is the largest city between San Francisco and Portland and the perfect home base for your Redwood adventure.","Filled with a rich history of gold mining and bustling port activity, nowhere is Eureka’s Victorian heritage more evident than in Old Town. Here you’ll find a meticulously restored district of shops, restaurants, galleries and museums. The Eureka Boardwalk is open for strolling and baywatching and is also home to the Carsion Mansion. If it is a water-facing activity you’re looking for, you’ll have no problem finding waterfront dining opportunities, kayaking excursions, oyster tours, or sunset cruises. Leaving, however, will be a challenge.","Head inland from the bay and you’ll find it hard to miss the massive old-growth redwood forest smack dab in the middle of Eureka (just under 70 acres to be exact). Developed trails, stairways, bridges and corduroy roads make this an easy adventure. Don’t forget to stop by the Sequoia Zoo to say hi to our magnificent red pandas or check out the new river otter experience. Few cities the size of Eureka have zoos, let alone world-class exhibits such as these.","Whether it is before or after you find yourself lost amongst the ever-famous Redwoods of Humboldt County, Eureka is a perfect jumping off point on any itinerary."],
        "direction":`<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d96670.51439250342!2d-124.21894337272111!3d40.78503477657445!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54d3ff83e6ff4ea7%3A0x2a860766b8290695!2z0IjRg9GA0LjQutCwLCDQmtCw0LvQuNGE0L7RgNC90LjRmNCwLCDQodGY0LXQtNC40ZrQtdC90LUg0JTRgNC20LDQstC1!5e0!3m2!1ssr!2srs!4v1607464516929!5m2!1ssr!2srs" width="600" height="450" frameborder="0" style="border:0;" allowfullscreen="" aria-hidden="false" tabindex="0"></iframe>`,
        "image":"eureka.jpg"
    },
    {
        "id":2,
        "name":"Arcata",
        "description": ["Arcata encompasses all that’s great about Humboldt County, from the giant Redwoods of the Community Forest to the eccentric and spirited streets downtown. With its lush green lawns and vibrant flowerbeds, The Plaza in central Arcata is perhaps the liveliest gathering spot in all of Humboldt. Delightful shops line quaint streets, as locals, tourists, and intellectuals wander, gawk, and ponder.","Being that Arcata is a college town, you might find the bookstores and coffee shops of particular interest. At certain times of the year, you might stumble upon the Kinetic Sculpture Race, or the world-famous Oyster Festival.","And do find the time to take a self-guided tour of the many beautifully restored Victorian homes. If “big city” life isn’t for you, take a walk on the wild side at the Arcata Marsh and Wildlife Sanctuary, or perhaps do a bit of hiking or biking amongst the trees in Arcata Community Forest and Redwood Park."],
        "direction":`<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d96582.59358643861!2d-124.12326392076943!3d40.84539972001063!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54d1570e67b9e801%3A0x7d8ad78fa1858786!2z0JDRgNC60LXRmNGC0LAsINCa0LDQu9C40YTQvtGA0L3QuNGY0LAsINCh0ZjQtdC00LjRmtC10L3QtSDQlNGA0LbQsNCy0LU!5e0!3m2!1ssr!2srs!4v1607464599171!5m2!1ssr!2srs" width="600" height="450" frameborder="0" style="border:0;" allowfullscreen="" aria-hidden="false" tabindex="0"></iframe>`,
        "image":"arcata.jpg"
    }
    ,{
        "id":3,
        "name":"Fortuna",
        "description": ["Known as “the Friendly City within the Redwood Forest”, Fortuna is the perfect launching base for all day trips because of its central location within the county. Fortuna’s proximity to Humboldt Redwoods State Park, Avenue of the Giants, Victorian Village of Ferndale, and Eureka make it easy to call it home during your getaway.","Home to a host of lodging and dining options, Fortuna is ideal for any visitor looking for a relaxing change of pace. In the summer, the whole town blossoms with art, wine, chili and beer festivals and a host of events perfect for letting your hair down."],
        "direction":`<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d96970.74896852802!2d-124.21501582938616!3d40.57834034976136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54d40a8b7db16ccf%3A0x33947768f4e3df6e!2z0KTQvtGA0YLRmNGD0L3QsCwg0JrQsNC70LjRhNC-0YDQvdC40ZjQsCwg0KHRmNC10LTQuNGa0LXQvdC1INCU0YDQttCw0LLQtQ!5e0!3m2!1ssr!2srs!4v1607464658923!5m2!1ssr!2srs" width="600" height="450" frameborder="0" style="border:0;" allowfullscreen="" aria-hidden="false" tabindex="0"></iframe>`,
        "image":"fortuna.jpg"
    }
    ,{
        "id":4,
        "name":"Ferndale",
        "description": ["Step back in time to the picture-perfect town of Ferndale, California. Nicknamed the Victorian Village for its fantastically preserved architecture, Ferndale is a vibrant, living postcard with a genuine welcoming feeling.","A still-thriving dairy industry led to the construction of Ferndale’s famous Victorian homes and gloriously ornate storefronts, some of the best in the West.  Transport yourself to a bygone era with a stroll down lamppost-lined Main Street, where you’ll find an authentic general store, candy shops, blacksmith, independent boutiques, saloons, and museums.","Ferndale pairs the best of the past with modern comforts and luxuries, from world-class accommodations to acclaimed restaurants, including some of the best historic lodging and dining options in the country. Explore the outdoors with a hike in Russ Park forest and bird sanctuary, just blocks from Main Street, or a visit to nearby Centerville Beach and the Lost Coast Headlands. A scenic setting amid peaceful farmland coupled with a convenient proximity to many of the activities and natural attractions in Humboldt County makes Ferndale the perfect place to stay during your redwoods vacation."],
        "direction":`<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12120.926277594004!2d-124.2710597129046!3d40.58064366954073!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54d410e319d10add%3A0x5a64970b8a68f249!2z0KTQtdGA0L3QtNC10ZjQuywg0JrQsNC70LjRhNC-0YDQvdC40ZjQsCA5NTUzNiwg0KHRmNC10LTQuNGa0LXQvdC1INCU0YDQttCw0LLQtQ!5e0!3m2!1ssr!2srs!4v1607464740163!5m2!1ssr!2srs" width="600" height="450" frameborder="0" style="border:0;" allowfullscreen="" aria-hidden="false" tabindex="0"></iframe>`,
        "image":"ferndale.jpg"
    },
    {
        "id":5,
        "name":"Trinidad",
        "description": ["Oh for the love of Trinidad! Entire romance novels are yet to be written about this tiny dot on the world map of love. Too poetic? Then you’ve never been here and now is the time. Your story is about to unfold.","Situated on the rugged Coast of Northern California, just a short 20 mile drive north of Eureka, this postage-stamp, picture-perfect town is perched on the cliffs above crashing waves. The gateway to the California Coastal National Monument, Trinidad promises tide pool exploration at Trinidad State Beach, leisurely hiking on Trinidad Head, and some crazy-good dining right on the Trinidad pier.","Shop for one-of-a-kind gifts, picnic supplies, or taste some wine if the mood strikes. Also, be sure the check out the Memorial Lighthouse and the Humboldt State Marine Lab. If you head home without visiting Trinidad… well, that will be one sad story to tell."],
        "direction":`<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12033.800926080463!2d-124.15199876266882!3d41.059150168728564!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54d1410375051f91%3A0x5883f55bfe13ae9b!2z0KLRgNC40L3QuNC00LDQtCwg0JrQsNC70LjRhNC-0YDQvdC40ZjQsCA5NTU3MCwg0KHRmNC10LTQuNGa0LXQvdC1INCU0YDQttCw0LLQtQ!5e0!3m2!1ssr!2srs!4v1607464825148!5m2!1ssr!2srs" width="600" height="450" frameborder="0" style="border:0;" allowfullscreen="" aria-hidden="false" tabindex="0"></iframe>`,
        "image":"trinidad.jpg"
    },
    {
        "id":6,
        "name":"County East",
        "description": ["East Humboldt County is the perfect Gateway to the rest of Humboldt County and all of it’s amazing offerings. At the heart of this picturesque region, you will find the world-renowned town of Willow Creek.","This where Bigfoot calls home. The rest of us are simply visitors. In addition to the China Flat Bigfoot Museum and the world’s largest collection of Bigfoot Artifacts, you will also find the very best of all that California’s mountains have to offer. Trinity River locals refer to it as, “River fun in the mountain sun.” Enjoy never-ending private swimming holes, rock jumping into deep pools (created by mother nature), and some of the California’s best whitewater rafting you’ll ever come across.","Some say that there’s so much to do in East Humboldt County, you might just decide to stay. You can even book a backcountry auto tour and get up close and personal with Six Rivers National Forest, enjoy a variety of wine tasting choices, sample the freshest produce from local farm stands, and as mentioned earlier… .share a little quality time with Bigfoot himself."],
        "direction":`<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193101.0788722806!2d-123.7973835772853!3d40.86738926548989!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54d17dbb5ba267c3%3A0xaea52bec721079ca!2z0JLQuNC70L7RgyDQmtGA0LjQuiwg0JrQsNC70LjRhNC-0YDQvdC40ZjQsCwg0KHRmNC10LTQuNGa0LXQvdC1INCU0YDQttCw0LLQtQ!5e0!3m2!1ssr!2srs!4v1607465088283!5m2!1ssr!2srs" width="600" height="450" frameborder="0" style="border:0;" allowfullscreen="" aria-hidden="false" tabindex="0"></iframe>`,
        "image":"east.jpg"
    },
    {
        "id":7,
        "name":"County North",
        "description": ["Northern Humboldt County is riddled with natural attractions that will only intensify one’s wanderlust. It’s a paradise for everyone from the adventure seeker to the leisure lover, just don’t forget to bring your camera.","Home to ancient and mystical Redwood National Park and Prairie Creek State Park, here you’ll find some of the largest trees in the entire world by embarking on over 75 miles of hiking, biking, and self-guided nature trails. Next, let yourself journey to Fern Canyon through well-marked paths over babbling streams and intense forest growth… suddenly to come upon a hidden canyon cut deep into the mountainside – a filming location for Steven Spilberg’s Jurrasic Park 2.","Don’t leave the area without stopping by Ladybird Johnson Grove named after the former First Lady herself. An easy, two-mile loop that ushers travelers through an enchanted forest of staggeringly immense trees, mushrooms, and moss. Regardless of the specific adventures you choose, you’ll find no greater relaxation than when you transport yourself to Northern Humboldt County."],
        "direction":`<iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d384551.9579491405!2d-124.2014465!3d41.1495391!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54d06636f5417fa5%3A0x36cf3266953b5f8e!2sRedwood%20National%20and%20State%20Parks!5e0!3m2!1ssr!2srs!4v1607465140295!5m2!1ssr!2srs" width="600" height="450" frameborder="0" style="border:0;" allowfullscreen="" aria-hidden="false" tabindex="0"></iframe>`,
        "image":"north.jpg"
    },
    {
        "id":8,
        "name":"Southern Humboldt",
        "description": ["As children, we all heard the stories about distant magical lands where giants live. But unlike those stories, this is a true story. In Southern Humboldt County, real giants live ancient and towering high up into the clouds: the mighty old-growth redwoods.","Just a half-day north of San Francisco, right off Highway 101, you will find the Avenue of the Giants, a leisurely and winding drive where some of the most massive redwoods on the planet. Trailheads and side roads quietly beckon. Along the route, you might want to stop in Pepperwood, Weott, or Phillipsville for some picnic supply shopping. If you feel like driving through a real redwood, visit the Shrine Drive Thru Tree in Myers Flatt. Be sure to stop by the Humboldt Redwoods State Park visitor center as well as the Founders’ Grove and the Rockefeller Forest to enjoy a moment of silence beneath the world’s largest strand of old growth trees.","Don’t forget to check out Benbow, a quaint scenic valley with great lodging perched next to the scenic South Fork Eel River. Or Garberville, a perfect spring board to many of Humboldt’s greatest outdoor excursions. Lastly, you wouldn’t be doing your vacation justice without a memorable drive to the cozy little village of Shelter cove with views of the famous Lost Coast of California. Shelter Cove is home to the unusual beaches covered in black sand, life-filled tidepools, and a level of relaxation you just can’t find anywhere else. It’s no wonder they call it the Lost Coast."],
        "direction":`<iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d387382.47186998575!2d-124.2793608!3d40.6645914!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54d463c73284e3b3%3A0x3716989f535a3fa!2sHumboldt%20Redwoods%20State%20Park!5e0!3m2!1ssr!2srs!4v1607465202775!5m2!1ssr!2srs" width="600" height="450" frameborder="0" style="border:0;" allowfullscreen="" aria-hidden="false" tabindex="0"></iframe>`,
        "image":"southern.jpg"
    }]

var Sightseeing = [{"id":1,"name":"You know you’ve witnessed some of the largest trees on the planet when you find yourself driving your car through the very center of one. The Shrine and Drive-Over Tree (Myers Flat) allows you to return home again with photographs to prove you were not subject to ingesting some of the local forest mushrooms and did, indeed, pass directly through a living giant.","adress":"13708 Avenue of the Giants, Myers Flat, CA 95554","number":"(707)-943-1975","directions":"https://www.google.com/maps/dir//13708+Avenue+of+the+Giants%2C+Myers+Flat%2C+CA+95554"},
{"id":2,"name":"RHODODENDRON TRAIL","description":"To find the magic of the Rhododendron Trail you must first begin your journey at the Prairie Creek Visitor Center on the edge of scenic Elk Prairie. The trail is lined with lichen-encrusted maples, blackberry brambles, and magnificent redwoods. If you do anything in Humboldt make sure you don’t miss the beautiful scenery of the Rhododendron Trail.","adress":"Prairie Creek Visitor Center, Newton B. Drury Scenic Parkway, Orick","number":"","directions":"https://www.google.com/maps/dir//Prairie+Creek+Visitor+Center%2C+Newton+B.+Drury+Scenic+Parkway%2C+Orick"},
{"id":3,"name":"PATRICK’S POINT STATE PARK","description":"Patrick’s Point State Park is the perfect location to watch whales, sea lions, and beautiful sunsets. Appropriately located in the heart of the California redwood coast and considered one of the most magical treasures of the rugged Northern Coast. Take long and memorable strolls over safe, well-marked paths, bridges, steps and stairs winding in and around the crashing blue Pacific. Plus, get up close and personal in an ancient Sumeg village. A good camera is required on Rim Trail, Wedding Rock, Ceremonial Rock, and a never-ending display of why California is famous the world over.","adress":"40630 CA-299, Willow Creek, CA 95573","number":"(530) 629-2263","directions":"https://www.google.com/maps/dir//4150+Patricks+Point+Drive%2C+Trinidad%2C+CA+95570"},
{"id":4,"name":"BIGFOOT RAFTING","description":"Come join the Bigfoot Rafting family for river fun in the mountain sun! Bigfoot Rafting has been popular with tourist and locals alike since 1984, making them one of the largest and most experienced rafting company in Northern California. While they offer action-packed whitewater rafting to calm gentle floats safety always comes first. All guides are CPR, First Aid, and Swift Water Rescue certified. And there is no need to bring anything Bigfoot Rafting has all the gear and rafts you need. They even have a shuttle service that takes you to the rafting site.","adress":"13708 Avenue of the Giants, Myers Flat, CA 95554","number":"(707)-943-1975","directions":"https://www.google.com/maps/dir//40630+CA-299%2C+Willow+Creek%2C+CA+95573"},
{"id":1,"name":"Shrine drive thru tree","description":"You know you’ve witnessed some of the largest trees on the planet when you find yourself driving your car through the very center of one. The Shrine and Drive-Over Tree (Myers Flat) allows you to return home agai…","adress":"13708 Avenue of the Giants, Myers Flat, CA 95554","number":"(707)-943-1975"},
{"id":1,"name":"Shrine drive thru tree","description":"You know you’ve witnessed some of the largest trees on the planet when you find yourself driving your car through the very center of one. The Shrine and Drive-Over Tree (Myers Flat) allows you to return home agai…","adress":"13708 Avenue of the Giants, Myers Flat, CA 95554","number":"(707)-943-1975"},
{"id":1,"name":"Shrine drive thru tree","description":"You know you’ve witnessed some of the largest trees on the planet when you find yourself driving your car through the very center of one. The Shrine and Drive-Over Tree (Myers Flat) allows you to return home agai…","adress":"13708 Avenue of the Giants, Myers Flat, CA 95554","number":"(707)-943-1975"},
{"id":1,"name":"Shrine drive thru tree","description":"You know you’ve witnessed some of the largest trees on the planet when you find yourself driving your car through the very center of one. The Shrine and Drive-Over Tree (Myers Flat) allows you to return home agai…","adress":"13708 Avenue of the Giants, Myers Flat, CA 95554","number":"(707)-943-1975"},];


var ActivityDDL=[{"id":1,"name":"Eureka"},{"id":2,"name":"Arcata"},{"id":3,"name":"Fortuna"},{"id":4,"name":"Eureka"},{"id":5,"name":"Eureka"},{"id":6,"name":"Eureka"},{"id":7,"name":"Eureka"},{"id":8,"name":"Eureka"}];
var LodgingDDL=[{"id":1,"name":"Eureka"},{"id":2,"name":"Arcata"},{"id":3,"name":"Fortuna"},{"id":4,"name":"Eureka"},{"id":5,"name":"Eureka"},{"id":6,"name":"Eureka"},{"id":7,"name":"Eureka"},{"id":8,"name":"Eureka"}];
var LocationDDL=[{"id":1,"name":"Eureka"},{"id":2,"name":"Arcata"},{"id":3,"name":"Fortuna"},{"id":4,"name":"Eureka"},{"id":5,"name":"Eureka"},{"id":6,"name":"Eureka"},{"id":7,"name":"Eureka"},{"id":8,"name":"Eureka"}];


// ***

// DODATNO

// ***


// ANIMATE METOD 

function showActivity(){
    $(this).children().find(".hold").animate({"opacity":"1","transition":"opacity 0.7s"});
}
function hideActivity(){  
    $(this).children().find(".hold").animate({"opacity":"0","transition":"opacity 0.4s"});
}

// Local Storage funkcionalnost 

function RemmemberID(e){
    e.preventDefault();
    // alert(this.dataset.id);
    localStorage.setItem("ActivityID",this.dataset.id);
    window.location.href="activities.html";
}

// GLUPI CSS - hate it x(
function CSS(){
    let div =  document.getElementsByClassName("headline")[1];
    console.log(div);
    div.style.padding="0px 60px 0px 0px";
}