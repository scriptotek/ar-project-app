# Augmented Library Reality prototype app 
This is a prototype app showcasing use of Augmented Reality (AR) in a library setting, regarding wayfinding and extended metadata.
It was developed as a joint project between Mandal Public Library and Oslo Science Library (both in Norway).

The AR platform is Wikitude and the operating system is Android.

To read more about the app, the development process, and the project, go to the [project's pages](https://scriptotek.github.io/ar-project/).

## Building the app

1. Clone the repository or download [a zipped version](https://github.com/scriptotek/ar-project-app/archive/master.zip) and unzip it.

2. The project folder does not include the Wikitude SDK itself. You need to download the Wikitude Android SDK with JavaScript API from [https://www.wikitude.com/download-wikitude-sdk-for-android/](https://www.wikitude.com/download-wikitude-sdk-for-android/) (tested with version 8.2.0). Unzip it and copy the `Library/wikitudesdk.aar` file into the `libs` folder of this project. The rest of the Wikitude SDK package can be safely discarded.

3. Get an SDK key from Wikitude and add it to `src/main/res/values/wikitude_license_key.xml`
   * You can get a free trial licence from Wikitude, see: [https://www.wikitude.com/documentation/latest/android/triallicense.html](https://www.wikitude.com/documentation/latest/android/triallicense.html).
   * There is also a Start-up Licence for companies: [https://www.wikitude.com/product/sdk-startup/](https://www.wikitude.com/product/sdk-startup/).
   * And there is an Educational Licence (the one we used): [https://www.wikitude.com/wikitude-academy/](https://www.wikitude.com/wikitude-academy/).
   * Note that trial licences such as these will include watermarks of various intensity.
   
4. Open [Android Studio](https://developer.android.com/studio) (we used version 3.3.1), select `File -> New -> Import Project`, locate the project folder (ar-project-app) and click `Ok`.

5. To run the app on a physical phone connected with a USB cable, make sure it has [developer mode and USB debugging enabled](https://developer.android.com/studio/debug/dev-options), then in Android Studio select `Run -> Run 'ar-project.app'` and cross your fingers!

Note: If you don't want to install Android Studio, the app can also be built and installed from the command line using Gradle (run `gradlew tasks` to see available tasks).

## Troubleshooting

To solve general issues you can try the following:

1. File  -> Re-import Gradle Project
2. File	 -> Sync Project with Gradle Files
3. Build -> Rebuild Project

If none of these help you, try a Google search...

## Known issues

Some builds of the app tend to crash, we don't know where the issue lies, but just run the app again from Android Studio until you get a stable working version.

## Data source

The app gets its data from a static json file at [https://ub-www01.uio.no/prosjekter/ar/wikitude/metadata/metadata.json](https://ub-www01.uio.no/prosjekter/ar/wikitude/metadata/metadata.json).
If you want to host your own data, just replace the $.getJSON request at line 340 in app.js with the URL of your own static data or API.
The data format is not documented, but should be self-explanatory.
Feel free to raise an issue on GitHub if not.
