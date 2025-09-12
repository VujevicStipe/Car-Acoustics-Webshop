import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import Product from "@/app/models/Product";

export async function POST(request: Request) {
  try {
    const productData = await request.json();

    await connectToDatabase();

    const createdProduct = await Product.create(productData);

    return NextResponse.json(
      { message: "Proizvod uspješno dodan", data: createdProduct },
      { status: 201 }
    );
  } catch (error) {
    console.error("Greška kod dodavanja proizvoda:", error);
    return NextResponse.json(
      { error: "Greška prilikom dodavanja proizvoda" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query: any = {};

  try {
    // --- Build query safely ---
    const category = searchParams.get("category");
    if (category) query.category = category;

    const priceMin = parseFloat(searchParams.get("price_min") || "0");
    const priceMax = parseFloat(searchParams.get("price_max") || "99999");
    query.price = { $gte: priceMin, $lte: priceMax };

    const brand = searchParams.get("brand");
    if (brand) query.brand = brand;

    const size = searchParams.get("size");
    if (size) query["specs.size"] = size;

    const speakerTypes = searchParams.getAll("type") || [];
    if (speakerTypes.length > 0) query["specs.type"] = { $in: speakerTypes };

    const channels = searchParams.get("channels");
    if (channels) query["specs.channels"] = channels;

    const androidAuto = searchParams.getAll("android_auto") || [];
    if (androidAuto.length > 0)
      query["specs.android_auto"] = { $in: androidAuto };

    const material = searchParams.getAll("material") || [];
    if (material.length > 0) query["specs.material"] = { $in: material };

    const search = searchParams.get("search");
    if (search) {
      const tokens = search.trim().split(/\s+/).filter(Boolean);
      if (tokens.length === 1)
        query.name = { $regex: tokens[0], $options: "i" };
      else if (tokens.length > 1)
        query.$and = tokens.map((token) => ({
          name: { $regex: token, $options: "i" },
        }));
    }

    // --- Connect to DB ---
    await connectToDatabase();

    // --- Limit result for safety ---
    const products = await Product.find(query).limit(200);

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Greška kod dohvaćanja proizvoda:", error);
    return NextResponse.json(
      { error: "Greška prilikom dohvaćanja proizvoda" },
      { status: 500 }
    );
  }
}

// export async function GET() {
//   try {
//     await connectToDatabase();

//     const products = await Product.find();

//     return NextResponse.json(products, { status: 200 });
//   } catch (error) {
//     console.error("Greška kod dohvaćanja proizvoda:", error);
//     return NextResponse.json(
//       { error: "Greška prilikom dohvaćanja proizvoda" },
//       { status: 500 }
//     );
//   }
// }
