<template lang="pug">
  b-nav(class="nav" tabs justified align="center")
    b-nav-item(to="/app/home" active-class="active")
      b-img(:src="require('../assets/svgs/home.svg')")
      .nav-link Home
    b-nav-item(to="/app/entity-summary" active-class="active")
      b-img(:src="require('../assets/svgs/entity.svg')")
      .nav-link Entity Summary
    b-nav-item(to="/app/variety-summary" active-class="active")
      b-img(:src="require('../assets/svgs/variety.svg')" )
      .nav-link Variety Summary
    b-nav-item(to="/app/field-summary" active-class="active")
      b-img(:src="require('../assets/svgs/field.svg')")
      .nav-link Field Summary
    <!-- b-nav-item(to="/app/payment" active-class="active")
      b-img(:src="require('../assets/svgs/payment.svg')")
      .nav-link Payment Schedule -->
</template>

<style lang='scss'>
.nav {
  position: absolute;
  bottom: 0;
  background: #e6f1ed;
  width: 100%;
  align-items: center;
  height: 12%;
  padding: 5px 10px 5px 10px;
}
.nav-link {
  font-family: Manjari;
  font-size: 9px;
  line-height: 108.4%;
  color: #50606d;
  padding: 5px;
}
.nav-item {
  a {
    padding: 10 0 0 0;
  }
}
.nav-item.active {
  background: $color;
  box-shadow: 0px 2px 8px rgba(90, 114, 106, 0.3),
    0px 1px 2px rgba(90, 114, 106, 0.2);
  border-radius: 18px;
}
.active {
  background: $color;
  box-shadow: 0px 2px 8px rgba(90, 114, 106, 0.3),
    0px 1px 2px rgba(90, 114, 106, 0.2);
  border-radius: 18px !important;
  border: none !important;
}
.nav-tabs .nav-link {
  border: none !important;
}
</style>
<script>
export default {};
</script>
