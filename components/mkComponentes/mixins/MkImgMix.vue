<script>
import MkImg from '@/components/mkComponentes/mkImg/MkImg';
export default {
  name: 'MkImgMix',
  components:{MkImg},
  data() {
    return {
      MkImgMix:true,
      mkImgData:{
        imgMenu:false,
        imgCanDel:true,
        imgDel:false,
        myImg: {hasImage:()=>false},
        imgFile:'',
        imgCanEdit:false,
        remove:false,
        refresh:false,
      }
    }
  },
  methods: {

  },
}
</script>
