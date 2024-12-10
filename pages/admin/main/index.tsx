import { fetchModule, fetchSSRModule } from "modules/front/FetchModule";
import { GetServerSideProps } from "next";
import { useState } from "react";
import SpinnerCoverage from "ts-components/common/SpinnerCoverage";

export const getServerSideProps: GetServerSideProps = async (context) => {
	let apiUrl = `${process.env.SERVER_HOST_URL}/api/admin/main`;
	//아래는 전체적인 예시 api, 실제 그대로 해당 api를 사용할 필요는 없음
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

export default function MainIndex(props:any) {
	const [banners, setBanners] = useState<any>(props.banners);
	const [certificates, setCertificates] = useState<any>(props.certificates);
	const [isUploading, setIsUploading] = useState<Boolean>(false);
	const handleFile = async (files: FileList | null, index: number, category:string) => {
		setIsUploading(true);
		if (typeof files == "undefined" || files == null) {
		  return;
		}
		if (files.length == 0) {
		  return;
		}
		const file = files[0];
		const fileName = file.name;
		const fileType = file.type;
		let reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = function () {
		  const base64Data: any = reader.result;
	
		  const testData = base64Data.replace(
			base64Data.split("base64,")[0] + "base64,",
			""
		  );
		  fetchModule({
			url: `/api/file-upload`,
			method: "post",
			body: JSON.stringify({
			  fileName,
			  fileType,
			  base64Data: testData,
			  parentPath: `main/${category}`,
			  order: index+1,
			}),
		  }).then((res: any) => {
			const url = "https://blcrasno-bucket.s3.ap-northeast-2.amazonaws.com/" + res.result.path;
			if (category == "banner"){
				let newBanners = [...banners]
				newBanners[index].url = url;
				setBanners(newBanners);
			} else if (category == "certificate") {
				let newCertificates = [...certificates]
				newCertificates[index].url = url;
				setCertificates(newCertificates);
			}
			
			setIsUploading(false);
		  });
		};
	  };

	return <section className="admin-section">
		{isUploading && <SpinnerCoverage />}
		<div className="card">
			<div className="card-body">
				<div className="section-title">메인페이지</div>
			</div>
		</div>
		<div className="card">
			<div className="card-body">
				<div className="section-sub-title">배너 관리</div>
				{banners.map((bannerItem:any, bannerIndex:number)=>{
					return <div className="banner-item" key={`banner-item-${bannerIndex}`}>
					<div className="">배너 {bannerIndex+1}</div>
					<div
						className="thumbnail"
                  		style={{
                    		backgroundImage: `url(${bannerItem.url})`,
                  			}}>
                	</div>
					<div className="upload-area">
					<input
						className="upload-input"
						type="file"
						id="thumbnail-upload"
						onChange={async (event) => {
						handleFile(event.target.files, bannerIndex, 'banner');
						}}
					/>
					<label className="upload-btn">
						<i className="fa-solid fa-upload"></i>업로드
					</label>
					</div>
				</div>
				})}
			</div>
			</div>
			<div className="card">
				<div className="card-body">
				<div className="section-sub-title">인증서 관리</div>
				{certificates.map((certificateItem:any, certificateIndex:number)=>{
					return <div className="banner-item" key={`certificate-item-${certificateIndex}`}>
					<div className="">인증서 {certificateIndex+1}</div>
					<div
						className="thumbnail"
                  		style={{
                    		backgroundImage: `url(${certificateItem.url})`,
                  			}}>
                	</div>
					<div className="upload-area">
					<input
						className="upload-input"
						type="file"
						id="thumbnail-upload"
						onChange={async (event) => {
						handleFile(event.target.files, certificateIndex, 'certificate');
						}}
					/>
					<label className="upload-btn">
						<i className="fa-solid fa-upload"></i>업로드
					</label>
					</div>
				</div>
				})}
				
			</div>
		</div>
	</section>;
}
