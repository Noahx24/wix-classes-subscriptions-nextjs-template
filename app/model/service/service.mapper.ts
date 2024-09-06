import { formatDuration, intervalToDuration } from 'date-fns';
import { services } from '@wix/bookings';
import { mapServiceOfferedAsDto } from '@app/model/service/service-offered-as.mapper';
import { mapServicePaymentDto } from '@app/model/service/service-payment.mapper';

export type ServiceInfoViewModel = NonNullable<
  ReturnType<typeof mapServiceInfo>
>;

export type ServiceImage = services.MediaItem;

export function mapServiceInfo(service?: services.Service) {
  if (!service) {
    return null;
  }

  // Safely access media properties
  const mainMedia = service?.media?.mainMedia ?? service?.media?.items?.[0];
  const coverMedia = service?.media?.coverMedia ?? service?.media?.items?.[0];
  const otherMediaItems = service?.media?.items?.filter((item) => !!item) as
    | ServiceImage[]
    | undefined;

  // Safely destructure service properties
  const { name, description, tagLine, _id: id } = service;

  // Get duration and format it
  const serviceDuration = getDuration(service);
  const formattedDuration = serviceDuration
    ? formatDuration(serviceDuration)
    : '';

  // Map service info safely
  return {
    id: id ?? '', // Ensure 'id' is defined or default to an empty string
    scheduleId: service?.schedule?._id ?? null, // Safely access schedule id
    info: {
      name: name ?? 'Unknown', // Provide a fallback for missing name
      description: description ?? null, // Ensure 'description' is null if not available
      tagLine: tagLine ?? null, // Ensure 'tagLine' is null if not available
      media: {
        mainMedia: mainMedia ?? null, // Safely handle missing media
        otherMediaItems: otherMediaItems ?? [],
        coverMedia: coverMedia ?? null,
      },
      formattedDuration: formattedDuration,
    },
    slug: service?.mainSlug?.name ?? '', // Safely access slug name
    type: service?.type ?? 'Unknown', // Provide a fallback for missing type
    categoryId: service?.category?._id ?? '', // Safely access category ID
    categoryName: service?.category?.name ?? 'Unknown', // Provide a fallback for missing category name
    payment: mapServicePayment(service), // Map payment info, assuming it's safe
  };
}

export function mapServicePayment(service: services.Service) {
  return {
    offeredAs: mapServiceOfferedAsDto(service),
    paymentDetails: mapServicePaymentDto(service),
  };
}
function getDuration(service?: services.Service) {
  return service?.schedule?.availabilityConstraints?.sessionDurations?.length
    ? intervalToDuration({
        start: 0,
        end:
          service.schedule.availabilityConstraints.sessionDurations[0] *
          60 *
          1000,
      })
    : undefined;
}
