const newsArray = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    "Sample news 1",
    "Sample news 2",
    "Sample news 1e308",
    "Sample news 10^^100",
    ()=>{return Math.round(Math.random()*1000).toString()}
]

const NewsComponent = {
    props: [],
    data(){
        return {
            newsText: "Default News 2"
        }
    },
    created(){
        this.newsArray=newsArray;
    },
    template: `
    <div class="news-text" v-on:animationend="RestartNews()">{{newsText}}</div>
    `
    ,
    methods: {
        RandomizeText(){
            let newsText;
            let news = newsArray[Math.round(Math.random()*newsArray.length)];
            if(news instanceof Function) newsText=news();
            if(news instanceof String) newsText=news;
            this.newsText=newsText;
        },
        RestartNews(){
            this.RandomizeText();
        }
    }
}