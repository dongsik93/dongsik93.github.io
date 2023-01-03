---
layout: post
title: "[Android] Shared Preference 암호화"
subtitle: "EncryptSharedPerference, KeyStore, RSA"
date: 2023-01-03 18:00:00 +0900
categories: til
tags: android keystore sharedpreference
comments: true

---



# [Android] Shared Preference 암호화

> 새해 첫 글 !!



앱내에 데이터를 캐싱할때 Room을 사용해서 저장하거나, SharedPreference로 값을 저장하곤 한다. SharedPreference를 사용하면

```xml
<map>
    <string name="lastSync">1672714107665</string>
</map>
```

위와 같이 xml에 단순 평문으로 저장된다.

큰 의미가 없는 단순한 사용자 입력값이라면 상관없지만, 유저의 개인정보나 토큰정보들이라면 위험할 수 있다. 단순 평문이기 때문에 해킹에 취약하기 때문이다.

이를 위해서 값을 저장할 때 암호화를 하면 된다. 암호화의 방법에는 외부라이브러리를 사용한다던지, 직접 구현해준다던지 여러가지 방법이 있지만, 이번에는 androidx.security를 통한 EncryptSharedPreference를 사용해보자.



### EncryptSharedPreference

Android Jetpack의 구성요소중 하나인 security에서 지원한다. SharedPreference의 wrapping 클래스로 Android SDK 23 (마시멜로 6.0) 부터 사용가능하다.

- 1.1.0-alpha버전부터는 SDK 21부터 사용이 가능

    > 안드로이드에서 제공하는 암호화 방식을 추가로 확인할 수 있다.
    >
    > [Cryptography](https://developer.android.com/guide/topics/security/cryptography){: class="underlineFill"}



먼저 23이상임을 가정하고 진행해보자.

1. #### Dependency추가

```groovy
// build.gradle(app)
/* EncryptSharedPreference */
implementation "androidx.security:security-crypto:1.0.0"
```

2. #### EncrypthSharedPreference 적용

래핑클래스기 때문에 기존에 사용하던 sharedPreference에 약간의 추가작업만 더해주면 그대로 사용이 가능하다.

```java
// EncryptedSharedPreferences.java
@NonNull
public static SharedPreferences create(@NonNull String fileName,
        @NonNull String masterKeyAlias,
        @NonNull Context context,
        @NonNull PrefKeyEncryptionScheme prefKeyEncryptionScheme,
        @NonNull PrefValueEncryptionScheme prefValueEncryptionScheme)
        throws GeneralSecurityException, IOException {
    DeterministicAeadConfig.register();
    AeadConfig.register();

    KeysetHandle daeadKeysetHandle = new AndroidKeysetManager.Builder()
            .withKeyTemplate(prefKeyEncryptionScheme.getKeyTemplate())
            .withSharedPref(context, KEY_KEYSET_ALIAS, fileName)
            .withMasterKeyUri(KEYSTORE_PATH_URI + masterKeyAlias)
            .build().getKeysetHandle();
    KeysetHandle aeadKeysetHandle = new AndroidKeysetManager.Builder()
            .withKeyTemplate(prefValueEncryptionScheme.getKeyTemplate())
            .withSharedPref(context, VALUE_KEYSET_ALIAS, fileName)
            .withMasterKeyUri(KEYSTORE_PATH_URI + masterKeyAlias)
            .build().getKeysetHandle();

    DeterministicAead daead = daeadKeysetHandle.getPrimitive(DeterministicAead.class);
    Aead aead = aeadKeysetHandle.getPrimitive(Aead.class);

    return new EncryptedSharedPreferences(fileName, masterKeyAlias,
            context.getSharedPreferences(fileName, Context.MODE_PRIVATE), aead, daead);
}
```

EncrypedSharedPreferences를 사용하기 위해서는 EncrypedSharedPreferences.create를 사용해야 한다. 매개변수로 fileName, masterKeyAlias, context, prefKeyEncryptionScheme, prefValueEncryptionScheme를 요구하고 있기 때문에 각각 해당하는 정보들을 만들어서 넣어주면 된다.

```kotlin
val sharedPreferences: SharedPreferences = EncryptedSharedPreferences.create(
    "encrypt_shared_preference",
    MasterKeys.getOrCreate(MasterKeys.AES256_GCM_SPEC),
    this,
    EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
    EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
)
```

- fileName
    - shared preference 파일명, path 구분자가 들어가면 안된다
- masterKeyAlias
    - Android KeyStore를 활용할 수 있는 MasterKeys
- prefKeyEncryptionScheme
    - key에 대한 암호화 방법
- prefValueEncryptionScheme
    - value에 대한 암호화 방법



```kotlin
sharedPreferences.edit().putString(key, value).apply()
```

sharedPreferences를 만들고 key, value를 넣고 apply를 해주면



```xml
// encrypt_shared_preference.xml
<?xml version='1.0' encoding='utf-8' standalone='yes' ?>
<map>
    <string name="__androidx_security_crypto_encrypted_prefs_key_keyset__">12a9015e1e83bd624de2a23bcce26f8700835ffb68c127383c5e48cd284c231fc86ac8b6017d47d07219c2bf40fa276a8d299be63178df14cc6e3499a0821705fef3b52593328e1a801e5d287707a188773a2cfd9f186d7b9257322266113df5e154694269d8343fc6ea47c9286fc69e14990bc6e11e515e5efb0d6d0c4d0de4a676b49e44f972f0c3cda2f27ff464997805f98d9566e77da86ad5b128b3eb07b23a0064850abd35004774931a44088dfacd9702123c0a30747970652e676f6f676c65617069732e636f6d2f676f6f676c652e63727970746f2e74696e6b2e4165735369764b65791001188dfacd97022001</string>
    <string name="ASLzfQ0DhzhDKRJynCq8f389f2RZhyfBIBpHmA==">ASnO6DNZth9zT0sPt1+CqwjciBe4ePs4qDMFfbyUzc2qPjiQ1iulbadsA+24EePPHEYT4U4l</string>
    <string name="__androidx_security_crypto_encrypted_prefs_value_keyset__">12880156ffd44314403089c69ebcbfb814533a40819b829a38016bb475a0fe199365d127e2e198ebd746c82728118ce8b5c391d2337b78a93ab76dd31c8fcd68176cda5e1204bf95106f43fac37f9ac43b1f4183a8d651f46f49eee36af57c6d1cd91e436ed94544142972d216b008adf0d5cc3e17148e80abdb14483638c0df24d99fead09b35c54230361a4408b3d0bbce02123c0a30747970652e676f6f676c65617069732e636f6d2f676f6f676c652e63727970746f2e74696e6b2e41657347636d4b6579100118b3d0bbce022001</string>
</map>
```

위에서 정해놓은 fileName으로 해당 xml이 생성되고, 그 안에 key / value 암호화 정보와 암호화된 데이터가 들어간걸 확인할 수 있다.



23미만, 즉 EncrypedSharedPreferences를 사용하지 못한다면 어떻게 shared preference를 암호화 할 수 있을까?

Android KeyStore와 RSA를 이용해서 직접 구현해보자.



### AES & RSA

EncrypedSharedPreferences에서는 AES256으로 지정해줬었는데, AES / RSA에 대해 간단하게 알아보고 가자

두 기법의 공통점은 데이터를 암호화, 복호화할 때 키를 사용한다는 점이며, 차이점은 암호화 복호화키를 공통된 키를 사용하느냐(AES), 따로 사용하느냐(RSA)의 차이이다.

AES는 비밀키 라는 공통된 키를, RSA는 공개키(암호화 용), 개인키(복호화 용)쌍을 사용한다.

그러므로 이 각 기법에 따른 키들을 기존에는 소스코드에 노출되었기 때문에, 디컴파일시 위협이 되었지만 이 키들을 KeyStore라는 클래스를 이용해 접근할 수 없는 곳에 넣는 것이다. 따라서 KeyStore는 말 그대로 키를 저장하고, 코드로 접근할 수 있는 영역이다.

그리고 이 키들을 생성하는 클래스는 AES는 KeyGenerator, RSA는 KeyPairGenerator다.



이제 본격적으로 Android KeyStore와 RSA로 암호화 / 복호화를 진행해보자

1. #### 키 생성

먼저 KeyStore를 이용해 RSA화를 사용해 Key를 만드는 과정이다.

```kotlin
val generator = KeyPairGenerator.getInstance(KeyProperties.KEY_ALGORITHM_RSA, "AndroidKeyStore")
val spec = KeyGenParameterSpec.Builder(alias, KeyProperties.PURPOSE_ENCRYPT or KeyProperties.PURPOSE_DECRYPT)
		.setAlgorithmParameterSpec(RSAKeyGenParameterSpec(2048, RSAKeyGenParameterSpec.F4))
		.setBlockModes(KeyProperties.BLOCK_MODE_CBC)
		.setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_RSA_PKCS1)
		.setDigests(KeyProperties.DIGEST_SHA512, KeyProperties.DIGEST_SHA384, KeyProperties.DIGEST_SHA256)
		.setUserAuthenticationRequired(false)
		.build()
```

- RSA는 KeyPairGenerator를 통해 키를 생성한다

- KeyGenParameterSpec.Builder를 통해 생성할 키에 대한 여러 속성들을 정의한다

    - setAlgorithmParameterSpec

        - 사용할 RSA 알고리즘의 KeySize, 공개키의 e값을 설정

    - setBlockModes

        - 블록암호운용방식을 설정

            > 블록 암호 운용 방식(영어: block cipher modes of operation)은 하나의 키 아래에서 블록 암호를 반복적으로 안전하게 이용하게 하는 절차를 말한다.[1][2] 블록 암호는 특정한 길이의 블록 단위로 동작하기 때문에, 가변 길이 데이터를 암호화하기 위해서는 먼저 이들을 단위 블록들로 나누어야 하며, 그리고 그 블록들을 어떻게 암호화할지 정해야 하는데, 이때 블록들의 암호화 방식을 운용 방식이라 부른다.

    - setEncryptionPaddings

        - 암호화/복호화 시 키를 사용할 수 있는 패딩값 설정
        - TLS/SSL 서버가 클라이언트에 대해 인증하기 위해 사용하는 RSA 개인 키의 경우 일반적으로 *`ENCRYPTION_PADDING_NONE`,* *`ENCRYPTION_PADDING_RSA_PKCS1`* 으로 설정한다

    - setDigests

        - 해당 키를 사용할수 있는 digest 알고리즘 집합 설정

    - setUserAuthenticationRequired

        - 사용자가 인증된 경우에만 이 키를 사용할 수 있는지 여부를 설정
        - 기본적으로 키는 사용자 인증 여부에 관계없이 사용할 수 있다

```kotlin
generator.apply {
    initialize(spec)
    generateKeyPair()
}
```

만들어준 키를 initialize 해주고 getnerate해주면 된다

2. #### 암호화

```kotlin
val cipher = Cipher.getInstance(TRANSFORMATION)
cipher.init(Cipher.ENCRYPT_MODE, entry!!.publicKey)

encryptedBytes = cipher.doFinal(bytes)
base64EncryptedBytes = Base64.encode(encryptedBytes, Base64.DEFAULT)
```

keyPairGenerator로 앞서 만들어둔 publicKey를 가지고 Cipher객체를 통해 암호화를 진행한다

RSA의 경우 암호화 가능한 길이가 딱 245byte 까지이기 때문에 245byte를 초과하는 데이터의 경우 적절한 처리를 해주어야 한다

3. #### 복호화

```kotlin
val cipher = Cipher.getInstance(TRANSFORMATION)

cipher.init(Cipher.DECRYPT_MODE, entry!!.privateKey)

base64EncryptedBytes = base64EncryptedCipherText.toByteArray(StandardCharsets.UTF_8)
encryptedBytes = Base64.decode(base64EncryptedBytes, Base64.DEFAULT)
```

복호화는 암호화와 동일하게 keyPairGenerator로 만들어둔 privateKey를 가지고 Cipher 객체를 통해 진행한다



해당 예제 소스 : [dongsik93 gitHub](https://github.com/dongsik93/blog-source/tree/master/encrypt){: class="underlineFill"}



### 참고사이트

- [RSA(공개키), AES(비밀키), SHA 암호화 설명](https://kkh0977.tistory.com/134){: class="underlineFill"}
- [안드로이드 KeyStore 비대칭(공개키, RSA) 암호화](https://gooners0304.tistory.com/entry/%EC%95%88%EB%93%9C%EB%A1%9C%EC%9D%B4%EB%93%9C-KeyStore-%EB%B9%84%EB%8C%80%EC%B9%AD-%EC%95%94%ED%98%B8%ED%99%94){: class="underlineFill"}
- [[Android] SharedPreference 암호화? 안드로이드 KeyStore에 대한 설명](https://g-y-e-o-m.tistory.com/141){: class="underlineFill"}
- [AndroidX에 추가된 Android Security 라이브러리는?](https://thdev.tech/android/2019/12/21/Android-Security-Library/){: class="underlineFill"}