'use client';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/hooks/use-toast";
import { submissions } from "@/services/submission";
import { Eye, X } from 'lucide-react';
import { useRef, useState } from "react";

const CarFormUploader = () => {
    const [images, setImages] = useState([]);
    const [previewImage, setPreviewImage] = useState(null);
    const [formValues, setFormValues] = useState({
        carModel: "",
        price: "",
        phoneNumber: "",
        city: "Lahore",
        maxImages: 1,
    });
    const [formErrors, setFormErrors] = useState({});
    const [tableData, setTableData] = useState([]);
    const fileInputRef = useRef(null);

    // Handle image upload
    // Handle image upload
    const handleImageUpload = async (e) => {
        const files = e.target.files;

        if (files) {
            const fileArray = Array.from(files).slice(0, formValues.maxImages - images.length);

            const newImagesPromises = fileArray.map((file) => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();

                    reader.onload = () => {
                        const base64String = reader.result; // Base64 encoded image string
                        resolve(base64String);
                    };

                    reader.onerror = reject;

                    reader.readAsDataURL(file);  // Convert the file to a Base64 string
                });
            });

            try {
                const base64Images = await Promise.all(newImagesPromises);

                // Update the images state with the new Base64 strings
                setImages((prev) => {
                    const updatedImages = [...prev, ...base64Images].slice(0, formValues.maxImages);
                    return updatedImages;
                });
            } catch (error) {
                console.error("Error converting images to Base64:", error);

                toast({
                    title: "Error",
                    description: "Failed to process the images. Please try again.",
                    variant: "destructive",
                });
            }
        }
    };


    // Remove image
    const removeImage = (index) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    // Validate individual field
    const validateField = (name, value) => {
        let error = "";

        switch (name) {
            case "carModel":
                if (!value || value.length < 3) {
                    error = "Car model must be at least 3 characters long.";
                }
                break;
            case "price":
                if (!value) {
                    error = "Price is required."; // Ensure price is required
                } else if (isNaN(value)) {
                    error = "Price must be a valid number.";
                }
                break;
            case "phoneNumber":
                if (!value || !/^\d{11}$/.test(value)) {
                    error = "Phone number must be exactly 11 digits.";
                }
                break;
            case "city":
                if (!value) {
                    error = "Please select a city.";
                }
                break;
        }

        setFormErrors((prev) => ({ ...prev, [name]: error }));
        return !error;
    };

    // Handle form submission

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate required fields
        const requiredFields = ["carModel", "price", "phoneNumber"];
        let isValid = true;

        requiredFields.forEach((field) => {
            const fieldValid = validateField(field, formValues[field]);
            if (!fieldValid) {
                isValid = false;
            }
        });

        const hasErrors = Object.values(formErrors).some((error) => error);



        if (isValid && !hasErrors) {
            // Prepare data for submission
            const submissionData = {
                ...formValues,
                images, // Images in Base64
            };

            console.log("Final Submission Data:", submissionData);
            console.log("FormValues:", formValues);
            console.log("Images state before submission:", images);

            try {
                // Call the submission service
                const response = await submissions(submissionData);

                console.log(response);

                // Show success toast
                toast({
                    title: "Success",
                    description: "Car details have been submitted successfully.",
                });

                // Update tableData with the new submission
                setTableData((prev) => [...prev, submissionData]);

                // Reset form
                setFormValues({
                    carModel: "",
                    price: "",
                    phoneNumber: "",
                    city: "Lahore",
                    maxImages: 1,
                });
                setImages([]);
                setFormErrors({});
            } catch (error) {
                console.error("Submission error:", error);
                // Show error toast
                toast({
                    title: "Submission Error",
                    description: "Failed to submit the car details. Please try again.",
                    variant: "destructive",
                });
            }
        } else {
            // Show validation error toast
            toast({
                title: "Validation Error",
                description: "Please fill out all required fields correctly.",
                variant: "destructive",
            });
        }
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({ ...prev, [name]: value }));
        validateField(name, value);
    };

    const resetTable = () => {
        setTableData([]);
    };

    return (
        <>

            <Toaster />
            <div className="flex flex-col lg:flex-row space-y-8 lg:space-y-0 lg:space-x-8">
                <div className="w-full lg:w-1/2 p-6 bg-white shadow-md rounded-md">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Car Model Field */}
                        <div>
                            <Label htmlFor="carModel">Car Model *</Label>
                            <Input
                                id="carModel"
                                type="text"
                                name="carModel"
                                value={formValues.carModel}
                                onChange={handleInputChange}
                                className={`w-full ${formErrors.carModel ? 'border-red-500' : ''}`}
                            />
                            {formErrors.carModel && (
                                <p className="text-sm text-red-500">{formErrors.carModel}</p>
                            )}
                        </div>

                        {/* Price Field */}
                        <div>
                            <Label htmlFor="price">Price *</Label>
                            <Input
                                id="price"
                                type="text"
                                name="price"
                                value={formValues.price}
                                onChange={handleInputChange}
                                className={`w-full ${formErrors.price ? 'border-red-500' : ''}`}
                            />
                            {formErrors.price && (
                                <p className="text-sm text-red-500">{formErrors.price}</p>
                            )}
                        </div>

                        {/* Phone Number Field */}
                        <div>
                            <Label htmlFor="phoneNumber">Phone Number *</Label>
                            <Input
                                id="phoneNumber"
                                type="text"
                                name="phoneNumber"
                                value={formValues.phoneNumber}
                                onChange={handleInputChange}
                                className={`w-full ${formErrors.phoneNumber ? 'border-red-500' : ''}`}
                            />
                            {formErrors.phoneNumber && (
                                <p className="text-sm text-red-500">{formErrors.phoneNumber}</p>
                            )}
                        </div>

                        {/* City Selection */}
                        <div>
                            <Label>City *</Label>
                            <div className="flex space-x-4">
                                <Label className="flex items-center">
                                    <Input
                                        type="radio"
                                        name="city"
                                        value="Lahore"
                                        checked={formValues.city === "Lahore"}
                                        onChange={handleInputChange}
                                        className="mr-2"
                                    />
                                    Lahore
                                </Label>
                                <Label className="flex items-center">
                                    <Input
                                        type="radio"
                                        name="city"
                                        value="Karachi"
                                        checked={formValues.city === "Karachi"}
                                        onChange={handleInputChange}
                                        className="mr-2"
                                    />
                                    Karachi
                                </Label>
                            </div>
                            {formErrors.city && (
                                <p className="text-sm text-red-500">{formErrors.city}</p>
                            )}
                        </div>

                        {/* No. of Copies */}
                        <div>
                            <Label htmlFor="maxImages">No. of Copies</Label>
                            <Select
                                onValueChange={(value) => {
                                    const maxImages = parseInt(value, 10);
                                    setFormValues((prev) => ({ ...prev, maxImages }));
                                    setImages((prev) => prev.slice(0, maxImages));
                                }}
                                value={formValues.maxImages.toString()}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select max images" />
                                </SelectTrigger>
                                <SelectContent>
                                    {[...Array(10)].map((_, i) => (
                                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                                            {i + 1}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Image Uploader */}
                        <div className="space-y-2">
                            <Label>Images</Label>
                            <div className="grid grid-cols-3 gap-4">
                                {images.map((image, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={image}
                                            alt={`Uploaded ${index + 1}`}
                                            className="w-full h-32 object-cover rounded-md"
                                        />
                                        <div className="absolute top-1 right-1 flex space-x-1">
                                            <Button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={16} />
                                            </Button>
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        type="button"
                                                        onClick={() => setPreviewImage(image)}
                                                        className="bg-blue-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <Eye size={16} />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Image Preview</DialogTitle>
                                                    </DialogHeader>
                                                    <img
                                                        src={previewImage}
                                                        alt="Preview"
                                                        className="w-full h-auto rounded-md"
                                                    />
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    </div>
                                ))}
                                {images.length < formValues.maxImages && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="h-32"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        Add Image
                                    </Button>
                                )}
                            </div>
                            <Input
                                type="file"
                                accept="image/*"
                                multiple
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                            <p className="text-sm text-gray-500">
                                {formValues.maxImages - images.length} image
                                {formValues.maxImages - images.length !== 1 ? "s" : ""} remaining
                            </p>
                        </div>

                        {/* Submit Button */}
                        <Button type="submit" variant="outline">
                            Submit
                        </Button>
                    </form>
                </div>

                {/* Data Table */}
                <div className="w-full lg:w-[calc(50%-1rem)] p-6 bg-white shadow-md rounded-md overflow-hidden">
                    <h2 className="text-xl font-semibold mb-4">Submitted Data</h2>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableCaption>A list of all submitted car data.</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Car Model</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>City</TableHead>
                                    <TableHead>Images</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tableData.map((data, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{data.carModel}</TableCell>
                                        <TableCell>{data.price}</TableCell>
                                        <TableCell>{data.phoneNumber}</TableCell>
                                        <TableCell>{data.city}</TableCell>
                                        <TableCell>
                                            {data.images.map((img, i) => (
                                                <img
                                                    key={i}
                                                    src={img}
                                                    alt={`Preview ${i}`}
                                                    className="inline-block h-10 w-10 object-cover rounded-md mr-2"
                                                />
                                            ))}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell colSpan={4}>Total Submissions</TableCell>
                                    <TableCell>{tableData.length}</TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </div>
                    <Button onClick={resetTable} variant="outline" className="mt-4">
                        Reset Table
                    </Button>
                </div>
            </div>
        </>
    );
};

export default CarFormUploader;