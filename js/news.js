const newsArray = [
    "This is a news ticker, or is it?",
    ()=>{return Math.round(Math.random()*1000000).toString()}
];
()=>{return Math.round(Math.random()*1000000).toString()}
const NewsComponent = {
    props: [],
    data(){
        return {
            newsText: "a b c",
            moving: true,
            travelDistance: 0,
            travelTime: 0,
            styleObject: {
                'animation-duration': "5s"
            },
            classObject: {
                'news-text': true,
                'news-text-moving': true
            }
        }
    },
    computed: {
    },
    created(){
        this.newsArray=newsArray;
        this.RestartNews();
    },
    template: `
    <div :class="classObject" :style="styleObject" v-on:animationend="RestartNews()">{{newsText}}</div>
    `
    ,
    methods: {
        RandomizeText(){
            let newsText;
            let news = newsArray[Math.round(Math.random()*(newsArray.length-1))];
            if(news instanceof Function) newsText=news();
            else newsText=news;
            this.newsText=newsText;
        },
        async RestartNews(){
            this.RandomizeText();
            this.classObject['news-text-moving']=false;
            //wait for class to be deleted
            await Vue.nextTick();
            var el = this.$el;
            el.style.animation = "none";
            //triggers reflow
            this.travelDistance = window.innerWidth + el.offsetWidth;
            this.travelTime = this.travelDistance / 150; //pixels per second
            this.styleObject['animation-duration']= this.travelTime + "s";
            el.style.animation = "";
            this.classObject['news-text-moving']=true;
            console.log("RestartNews called" + this.offsetwidth);
        }
    }
}