package no.uio.ub.arbib;

import com.wikitude.architect.ArchitectStartupConfiguration;
import com.wikitude.architect.ArchitectView;
import com.wikitude.common.camera.CameraSettings;
import com.wikitude.sdksamples.R;

import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.webkit.WebView;
import android.widget.Toast;

import java.io.IOException;

/**
 * This Activity is (almost) the least amount of code required to use the
 * basic functionality for Image-/Instant- and Object Tracking.
 *
 * This Activity needs Manifest.permission.CAMERA permissions because the
 * ArchitectView will try to start the camera.
 */
public class ArActivity extends AppCompatActivity {

    private static final String TAG = ArActivity.class.getSimpleName();

    /**
     * The ArchitectView is the core of the AR functionality, it is the main
     * interface to the Wikitude SDK.
     * The ArchitectView has its own lifecycle which is very similar to the
     * Activity lifecycle.
     * To ensure that the ArchitectView is functioning properly the following
     * methods have to be called:
     *      - onCreate(ArchitectStartupConfiguration)
     *      - onPostCreate()
     *      - onResume()
     *      - onPause()
     *      - onDestroy()
     * Those methods are preferably called in the corresponding Activity lifecycle callbacks.
     */
    protected ArchitectView architectView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Used to enabled remote debugging of the ArExperience with google chrome https://developers.google.com/web/tools/chrome-devtools/remote-debugging
        WebView.setWebContentsDebuggingEnabled(true);

        /*
         * The ArchitectStartupConfiguration is required to call architectView.onCreate.
         * It controls the startup of the ArchitectView which includes camera settings,
         * the required device features to run the ArchitectView and the LicenseKey which
         * has to be set to enable an AR-Experience.
         */
        final ArchitectStartupConfiguration config = new ArchitectStartupConfiguration(); // Creates a config with its default values.

        // Has to be set, to get a trial license key visit http://www.wikitude.com/developer/licenses.
        config.setLicenseKey(getString(R.string.wikitude_license_key));

        // Use back camera
        config.setCameraPosition(CameraSettings.CameraPosition.BACK);

        // The default resolution is 640x480.
        config.setCameraResolution(CameraSettings.CameraResolution.SD_640x480);

        // The default focus mode is continuous focusing.
        config.setCameraFocusMode(CameraSettings.CameraFocusMode.CONTINUOUS);

        config.setCamera2Enabled(true);

        // This tells the ArchitectView which AR-features it is going to use
        config.setFeatures(ArchitectStartupConfiguration.Features.ImageTracking);

        architectView = new ArchitectView(this);
        architectView.onCreate(config); // create ArchitectView with configuration

        setContentView(architectView);
    }

    @Override
    protected void onPostCreate(@Nullable Bundle savedInstanceState) {
        super.onPostCreate(savedInstanceState);
        architectView.onPostCreate();

        try {
            /*
             * Loads the AR-Experience, it may be a relative path from assets,
             * an absolute path (file://) or a server url.
             *
             * To get notified once the AR-Experience is fully loaded,
             * an ArchitectWorldLoadedListener can be registered.
             */
            architectView.load("html/index.html");
        } catch (IOException e) {
            Toast.makeText(this, getString(R.string.error_loading_ar_experience), Toast.LENGTH_SHORT).show();
            Log.e(TAG, "Exception while loading arExperience.", e);
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        architectView.onResume(); // Mandatory ArchitectView lifecycle call
    }

    @Override
    protected void onPause() {
        super.onPause();
        architectView.onPause(); // Mandatory ArchitectView lifecycle call
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        /*
         * Deletes all cached files of this instance of the ArchitectView.
         * This guarantees that internal storage for this instance of the ArchitectView
         * is cleaned and app-memory does not grow each session.
         *
         * This should be called before architectView.onDestroy
         */
        architectView.clearCache();
        architectView.onDestroy(); // Mandatory ArchitectView lifecycle call
    }

}
