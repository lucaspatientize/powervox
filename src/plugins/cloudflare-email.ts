/**
 * Cloudflare Email Sending provider for EmDash.
 *
 * This project's @emdash-cms/cloudflare@0.1.1 does not ship cloudflareEmail(),
 * so we register the same native plugin locally. EmDash auto-enables config
 * plugins with no _plugin_state row and auto-selects the sole email:deliver
 * provider in production.
 */
import { definePlugin } from "emdash";
import type {
	EmailDeliverEvent,
	PluginContext,
	PluginDescriptor,
	ResolvedPlugin,
} from "emdash";

export interface CloudflareEmailConfig {
	/** send_email binding name in wrangler.jsonc. Default: EMAIL */
	binding?: string;
	/** Sender on a domain onboarded for Cloudflare Email Sending */
	from: string | { email: string; name?: string };
	replyTo?: string;
}

interface SendEmailBinding {
	send(message: {
		to: string | string[];
		from: string | { email: string; name?: string };
		subject: string;
		text?: string;
		html?: string;
		replyTo?: string;
	}): Promise<{ messageId?: string }>;
}

async function loadWorkerEnv(): Promise<Record<string, unknown>> {
	try {
		const mod = (await import("cloudflare:workers")) as { env?: Record<string, unknown> };
		if (!mod.env) {
			throw new Error("missing env");
		}
		return mod.env;
	} catch {
		throw new Error(
			"[cloudflare-email] cloudflare:workers is not available — this provider only runs on the Cloudflare Workers runtime (deployed or via astro dev with the Cloudflare adapter).",
		);
	}
}

function fromAddress(config: CloudflareEmailConfig): { email: string; name?: string } {
	return typeof config.from === "string" ? { email: config.from } : config.from;
}

function assertValidFrom(config: CloudflareEmailConfig): void {
	const email = fromAddress(config).email;
	if (!email || !email.includes("@")) {
		throw new Error(
			'[cloudflare-email] config.from is required (e.g. { from: "cms@powervox.com.br" })',
		);
	}
}

export function createCloudflareEmailDeliver(
	config: CloudflareEmailConfig,
	loadEnv: () => Promise<Record<string, unknown>> = loadWorkerEnv,
): (event: EmailDeliverEvent, ctx: PluginContext) => Promise<void> {
	const bindingName = config.binding ?? "EMAIL";
	const from = fromAddress(config);

	return async (event, ctx) => {
		const env = await loadEnv();
		const binding = env[bindingName] as SendEmailBinding | undefined;
		if (!binding || typeof binding.send !== "function") {
			throw new Error(
				`[cloudflare-email] send_email binding "${bindingName}" not found — declare it in wrangler.jsonc ("send_email": [{ "name": "${bindingName}" }]).`,
			);
		}

		const result = await binding.send({
			from,
			to: event.message.to,
			subject: event.message.subject,
			text: event.message.text,
			...(event.message.html ? { html: event.message.html } : {}),
			...(config.replyTo ? { replyTo: config.replyTo } : {}),
		});

		ctx.log.info("email delivered via Cloudflare Email Sending", {
			to: event.message.to,
			subject: event.message.subject,
			messageId: result?.messageId,
		});
	};
}

export function createPlugin(config: CloudflareEmailConfig): ResolvedPlugin {
	assertValidFrom(config);
	return definePlugin({
		id: "cloudflare-email",
		version: "1.0.0",
		capabilities: ["email:provide"],
		hooks: {
			"email:deliver": {
				exclusive: true,
				handler: createCloudflareEmailDeliver(config),
			},
		},
	});
}

export function cloudflareEmail(config: CloudflareEmailConfig): PluginDescriptor {
	assertValidFrom(config);
	return {
		id: "cloudflare-email",
		version: "1.0.0",
		entrypoint: new URL("./cloudflare-email.ts", import.meta.url).href,
		format: "native",
		options: config,
		capabilities: ["email:provide"],
	};
}

export default createPlugin;
