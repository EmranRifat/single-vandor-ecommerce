import { NextRequest, NextResponse } from "next/server";

const callbackActions = new Set(["success", "fail", "cancel", "ipn"]);

type RouteContext = {
  params: Promise<{ action: string }> | { action: string };
};

const readPayload = async (request: NextRequest) => {
  if (request.method === "GET") {
    return Object.fromEntries(request.nextUrl.searchParams.entries());
  }

  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return request.json();
  }

  if (
    contentType.includes("application/x-www-form-urlencoded") ||
    contentType.includes("multipart/form-data")
  ) {
    const formData = await request.formData();

    return Object.fromEntries(formData.entries());
  }

  const rawBody = await request.text();

  if (!rawBody) {
    return {};
  }

  return Object.fromEntries(new URLSearchParams(rawBody).entries());
};

const postToBackend = async (action: string, payload: Record<string, unknown>) => {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL?.trim();

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_BACKEND_API_URL is not defined");
  }

  const response = await fetch(`${baseUrl}/api/payment/ssl/${action}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  const text = await response.text();
  const result = text ? JSON.parse(text) : {};

  if (!response.ok || result.status === "error") {
    throw new Error(
      result.message || result.error || `SSLCommerz ${action} callback failed`,
    );
  }

  return result as Record<string, unknown>;
};

const buildRedirectUrl = (
  request: NextRequest,
  action: string,
  payload: Record<string, unknown>,
  result: Record<string, unknown>,
) => {
  const url = new URL(`/payment/ssl/${action}`, request.nextUrl.origin);
  const data =
    result.data && typeof result.data === "object"
      ? (result.data as Record<string, unknown>)
      : {};
  const params = {
    ...payload,
    ...data,
    ...result,
    status: String(result.status || action),
  };

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || typeof value === "object") {
      return;
    }

    url.searchParams.set(key, String(value));
  });

  return url;
};

const handleSslCallback = async (request: NextRequest, context: RouteContext) => {
  const { action } = await Promise.resolve(context.params);

  if (!callbackActions.has(action)) {
    return NextResponse.json(
      { error: "Unsupported SSLCommerz callback action" },
      { status: 404 },
    );
  }

  try {
    const payload = (await readPayload(request)) as Record<string, unknown>;
    const result = await postToBackend(action, payload);

    if (action === "ipn") {
      return NextResponse.json(result);
    }

    return NextResponse.redirect(
      buildRedirectUrl(request, action, payload, result),
      { status: 303 },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "SSLCommerz callback failed";

    if (action === "ipn") {
      return NextResponse.json({ error: message }, { status: 500 });
    }

    const url = new URL(`/payment/ssl/${action}`, request.nextUrl.origin);
    url.searchParams.set("status", "error");
    url.searchParams.set("message", message);

    return NextResponse.redirect(url, { status: 303 });
  }
};

export const GET = handleSslCallback;
export const POST = handleSslCallback;
