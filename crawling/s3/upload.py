import io
import boto3
import requests
import os
from uuid import uuid4


def upload_image_to_s3(image_url: str, folder="cosmetic-image") -> str:
    # S3 업로드 함수

    # .env에 있는 S3 환경 반영
    bucket = os.environ["S3_NAME"]
    s3 = boto3.client(
        "s3",
        aws_access_key_id=os.environ["S3_ACCESS_KEY"],
        aws_secret_access_key=os.environ["S3_SECRET_KEY"],
        region_name=os.environ["S3_REGION"]
    )

    # 이미지 다운로드
    response = requests.get(image_url)
    if response.status_code != 200:
        raise Exception(f"이미지 다운로드 실패: {image_url}")

    # 확장자 추출
    ext = image_url.split(".")[-1].split("?")[0]
    # uuid4() 16진수로 구성된 8-4-4-4-12의 형식을 가진 랜덤 32개의 "Universally Unique Identifier" 2^122 개의 조합
    filename = f"{folder}/{uuid4()}.{ext}"

    # 파이썬에서 메모리 상에서 파일처럼 사용할 수 있는 객체를 만드는 방식
    file_obj = io.BytesIO(response.content)

    # s3에 업로드
    s3.upload_fileobj(
        Fileobj=file_obj,
        Bucket=bucket,
        Key=filename,
        ExtraArgs={"ContentType": f"image/{ext}"}
    )

    # s3 주소 반환
    return f"https://{bucket}.s3.{os.environ['S3_REGION']}.amazonaws.com/{filename}"
