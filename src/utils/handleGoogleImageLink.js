const driveDefaultURL = "https://drive.google.com/uc?export=view&id=";
const driveExpectedURL = "https://lh3.googleusercontent.com/d/"

export const handleGoogleImageLink = (oldLink) => {
	return oldLink.replaceAll(driveDefaultURL, driveExpectedURL)
}
