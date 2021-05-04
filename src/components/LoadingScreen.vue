<template lang="pug">
    .loading-container
        .dot
        .dot
        .dot
        h1.title Loading
</template>

<style lang="scss">
.loading-container{
    position: absolute;
    left:50%;
    top:50%;
    transform: translate(-50%, -50%);
    .dot{
        height: 20px;
        width:  20px;
        border-radius: 50%;
        display: inline-block;
        margin: .5rem;
        animation: scaling 2.5s ease-in-out infinite
    }
    @keyframes scaling {
        0%, 100%{
            transform: scale(0.2);
            background-color: #a0ce4b;
        }
        40%{
            transform: scale(1);
            background-color: #89B831;
        }
        50%{
            transform: scale(1);
            background-color: #F8A79E;
        }
    }

    .dot:nth-child(1){
        animation-delay:0s;
    }
    .dot:nth-child(2){
        animation-delay:0.2s;
    }
    .dot:nth-child(3){
        animation-delay:0.4s;
    }
    .title{
        color : #89B831;
    }
}
</style>


<script>
export default {
	name : 'loading-screen',

};
</script>
