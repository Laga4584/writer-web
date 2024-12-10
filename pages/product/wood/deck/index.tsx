import { deckClip } from "data/deckClip";
import { fetchSSRModule } from "modules/front/FetchModule";
import { GetServerSideProps } from "next";
import { useEffect, useRef, useState } from "react";
import YouTube, { YouTubeProps } from 'react-youtube';

export const getServerSideProps: GetServerSideProps = async (context) => {
  let queryData = context.query;
let apiUrl = `${process.env.SERVER_HOST_URL}/api/deck`;
const apiData = await fetchSSRModule(
  context,
  {
    url: apiUrl,
    method: 'GET',
  },
  false,
);

if (apiData.isError == true) {
  return apiData.data;
}
let props: any = apiData.data;
if (typeof apiData.metaInfo != 'undefined') {
  props.metaInfo = apiData.metaInfo;
}
return {
  props
};
};

export default function Wood(props:any) {
  const youtubeVideo = (videoId:string, width:number) => {
    const onPlayerReady: YouTubeProps['onReady'] = (event) => {
      // access to player in all event handlers via event.target
      event.target.pauseVideo();
    }
  
    const opts: YouTubeProps['opts'] = {
      width: rowWidth,
      height: rowWidth/4*3,
      playerVars: {
        autoplay: 1,
      },
    };
  
    return <YouTube videoId={videoId} opts={opts} onReady={onPlayerReady} />;
  }
  const rowRef = useRef<HTMLDivElement>(null);
  const [rowWidth, setRowWidth] = useState<number>(0);
  useEffect(()=>{
    if(rowRef.current) {
      setRowWidth(rowRef.current.offsetWidth*0.3);
    }
  }, [rowRef])
  return (
    <section className="deck-section">
      <div className="title-area">
        <p className="title">우드데크</p>
      </div>
      <p className="text-center my-2">
        목재 데크를 고급스럽게 DIY 시공합니다.
      </p>
      {/* <div className="sub-title">
        Fence DIY 시공 조립 방법
      </div> */}
      <div className="row" ref={rowRef}>
        {rowWidth != 0 && 
        <>
        <div className="col-4">{youtubeVideo("Ppu0PpuPVIU", rowWidth)}</div>
        <div className="col-4">{youtubeVideo("zLUTIyoLiZA", rowWidth)}</div>
        <div className="col-4">{youtubeVideo("jxC17_qM7xw", rowWidth)}</div>
        </>
      }
      </div>
      {/* <div className="sub-title">history</div> */}
      {/* <div className="image" style={{
                          backgroundImage: `url(${props.intro[0].url})`,
                        }}></div>
      <p className="text-center">비엘텍크라스노의 데크 제품을 소개합니다.</p>
      <div className="sub-title">데크 소재</div>
      {props.materials.map((materialItem:any, materialIndex:number)=>{
        return <div className="image-area" key={`material-image-${materialIndex}`} style={{
          backgroundImage: `url(${materialItem.url})`,
        }}></div>
      })}
      <div className="sub-title">연결 클립</div>
      <div className="info-area">
        {props.products.map((item:any, index:number) => {
          return (
            <div className="item" key={`product-${index}`}>
              <p className="item-title">{item.name}</p>
              <div className="item-image-area">
                <div className="item-image-col">
                {item.images.products.map((productImage:any, imageIndex:number) => {
                  return (
                      <div
                        className="item-image"
                        style={{
                          backgroundImage: `url(${productImage.url})`,
                        }}
                        key={`deck-item-product-image-${imageIndex}`}
                      ></div>
                  );
                })}
                </div>
                <div className="item-image-col">
                {item.images.drafts.map((productImage:any, imageIndex:number) => {
                  return (
                      <div
                        className="item-image"
                        style={{
                          backgroundImage: `url(${productImage.url})`,
                        }}
                        key={`deck-item-draft-image-${imageIndex}`}
                      ></div>
                  );
                })}
                </div>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>품명</th>
                    <th>사용높이</th>
                    <th>재료두께</th>
                    <th>재료명</th>
                  </tr>
                </thead>
                <tbody>
                  {item.productInfos.map((infoItem:any, infoIndex:number) => {
                    return (
                      <tr key={infoIndex}>
                        <td>{infoItem.name}</td>
                        <td>{infoItem.height}</td>
                        <td>{infoItem.thickness}</td>
                        <td>{infoItem.material}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        })}
      </div> */}
    </section>
  )
}
